import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleEnum } from 'src/roles/role.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { User } from 'src/users/user.decorator';
import { CustomersService } from './customers.service';
import { CreateCustomerByUsernameDto } from './dto/create-customer-by-username.dto';
import { QueryCustomerEntityDto } from './dto/query-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Auth([RoleEnum.Superuser, RoleEnum.Admin])
  @Post()
  create(@Body() createCustomerByUsernameDto: CreateCustomerByUsernameDto) {
    return this.customersService.createByUsername(createCustomerByUsernameDto);
  }

  @Auth([RoleEnum.Superuser, RoleEnum.Admin])
  @Get()
  findAll(@Query() queryCustomerEntityDto: QueryCustomerEntityDto) {
    return this.customersService.findAll(queryCustomerEntityDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  findOne(
    @Param('username') username: UserEntity['username'],
    @User('username') currentUsername: UserEntity['username'],
    @User('role') currentRole: RoleEnum,
  ) {
    if (
      [RoleEnum.Customer].includes(currentRole) &&
      currentUsername !== username
    ) {
      throw new ForbiddenException({
        message: 'not_allowed.read.other_customer',
      });
    }
    return this.customersService.findOne(username);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':username')
  update(
    @Param('username') username: UserEntity['username'],
    @Body() updateCustomerDto: UpdateCustomerDto,
    @User('username') currentUsername: UserEntity['username'],
    @User('role') currentRole: RoleEnum,
  ) {
    if (
      currentUsername !== username &&
      [RoleEnum.Company, RoleEnum.Customer].includes(currentRole)
    )
      throw new ForbiddenException({
        message: 'not_allowed.update.other_customer',
      });

    return this.customersService.update(username, updateCustomerDto);
  }
}
