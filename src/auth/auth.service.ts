import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import jwtConfig from 'src/_config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { SignUpDto } from './dto/sign-up.dto';
import { DuplicatedException } from 'src/_common/exceptions/duplicated.exception';
import { JwtService } from '@nestjs/jwt';
import { JwtManager } from './jwt.manager';
import { RoleEnum } from 'src/roles/role.enum';
import { CustomersService } from 'src/customers/customers.service';
import { TargetTypes } from 'src/notifications/interfaces/notification-target.interface';
import { NotificationVisibilityEnum } from 'src/notifications/notification-visibility.enum';
import { NotificationTypeEnum } from 'src/notifications/notification-type.enum';
import { UserSignedUpEvent } from './events/user-signed-up.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MailsService } from 'src/mails/mails.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { decodeBase64, encodeBase64 } from 'src/_common/utils/base64.util';
import { URL } from 'url';
import appConfig from 'src/_config/app.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailsService: MailsService,
    private readonly customersService: CustomersService,
    @Inject(jwtConfig.KEY)
    private config: ConfigType<typeof jwtConfig>,
    @Inject(appConfig.KEY)
    private applicationConfig: ConfigType<typeof appConfig>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async signIn(credential: SignInDto) {
    const user = await this.usersService.findOneOrFail(credential.username);

    if (await user.checkPassword(credential.password)) {
      const payload = {
        id: user.id,
        username: user.username,
        role: user.role.name,
      };

      return {
        role: user.role.name,
        access_token: this.jwtService.sign(payload),
        expires_in: this.config.expiresIn,
      };
    }

    throw new UnauthorizedException();
  }

  private generateActivationToken(username: UserEntity['username']) {
    const payload = { username };
    const jwtToken = this.jwtService.sign(payload, {
      expiresIn: this.applicationConfig.activation.expiresIn,
      secret: this.applicationConfig.keys.auth,
    });
    const activation_token = encodeBase64(jwtToken);
    return activation_token;
  }

  async signUp(payload: SignUpDto) {
    const existedUser = await this.usersService.existByUsername(
      payload.username,
    );

    if (existedUser) throw new DuplicatedException();

    const activationToken = this.generateActivationToken(payload.username);

    const createUserDto = {
      ...payload,
      role: RoleEnum.Customer,
      activation_token: activationToken,
    };

    const createdUser = await this.usersService.create(createUserDto);

    await this.customersService.create({
      address: null,
      phone: null,
      email: payload.email,
      full_name: null,
      user: createdUser,
    });

    await this.notifyUserSignUpToModerators(createdUser);

    await this.mailsService.sendMail(
      {
        template: 'activation',
        recipient: payload.email,
        subject: 'Activate your Quadaland account',
      },
      {
        activation_url: new URL(
          `activate/${activationToken}`,
          this.applicationConfig.urls.front_site,
        ),
        email: payload.email,
      },
    );

    return {
      success: true,
      data: {
        username: payload.username,
      },
    };
  }

  private async notifyUserSignUpToModerators(user) {
    const userSignedUpEvent = new UserSignedUpEvent();

    userSignedUpEvent.notification.type = NotificationTypeEnum.NewSignedUpUser;

    userSignedUpEvent.notification.visibility =
      NotificationVisibilityEnum.Admin;

    userSignedUpEvent.notification.subject = user.username;

    userSignedUpEvent.notification.target = {
      id: user.username,
      type: TargetTypes.User,
    };

    userSignedUpEvent.channelName = 'private-moderators';

    await this.eventEmitter.emit('user.signed-up', userSignedUpEvent);
  }

  async signOut(authorizationHeader: string) {
    const jwtManager = JwtManager.getInstance();

    const token = jwtManager.extractTokenFromAuthorizationHeader(
      authorizationHeader,
    );
    jwtManager.revoke(token);

    return {
      success: true,
    };
  }

  async activateAccount(activationToken: string) {
    if (!activationToken)
      throw new BadRequestException({
        message: 'invalid.activation_token',
      });

    const jwtToken = decodeBase64(activationToken);

    try {
      const decoded = await this.jwtService.verifyAsync(jwtToken, {
        secret: this.applicationConfig.keys.auth,
      });
      await this.verifyActivationToken(decoded.username, activationToken);

      await this.usersService.activate(decoded.username);
    } catch (err) {
      if ((err.message = 'jwt malformed'))
        throw new BadRequestException({
          message: 'invalid.activation_token',
        });
      throw err;
    }

    return {
      success: true,
    };
  }

  private async verifyActivationToken(username, token) {
    const user = await this.usersService.findOne(username);

    if (user.activation_token !== token) {
      throw new ForbiddenException();
    }

    return user;
  }
}
