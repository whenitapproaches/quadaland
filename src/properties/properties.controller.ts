import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Auth } from 'src/auth/auth.decorator';
import { RoleEnum } from 'src/roles/role.enum';
import { PropertyEntity } from './entities/property.entity';
import { User } from 'src/users/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtAuthOptionalGuard } from 'src/auth/jwt-auth-optional.guard';
import { QueryPropertyEntityDto } from './dto/query-property.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Auth([RoleEnum.Superuser, RoleEnum.Admin, RoleEnum.Company])
  @Post()
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @User('role') currentRole: RoleEnum,
    @User('username') currentUsername: UserEntity['username'],
  ) {
    if ([RoleEnum.Company].includes(currentRole))
      return this.propertiesService.createByCompany(
        createPropertyDto,
        currentUsername,
      );

    return this.propertiesService.createByAdmin(
      createPropertyDto,
      currentUsername,
    );
  }

  @UseGuards(JwtAuthOptionalGuard)
  @Get()
  findAll(
    @Query() queryPropertyEntityDto: QueryPropertyEntityDto,
    @User('role') currentRole: RoleEnum,
    @User('username') currentUsername: UserEntity['username'],
  ) {
    if (queryPropertyEntityDto.coordinates)
      return this.propertiesService.findByCoordinates(queryPropertyEntityDto);

    if ([RoleEnum.Superuser, RoleEnum.Admin].includes(currentRole))
      return this.propertiesService.findAll(queryPropertyEntityDto);

    if ([RoleEnum.Company].includes(currentRole))
      return this.propertiesService.findAllByCompany(
        queryPropertyEntityDto,
        currentUsername,
      );

    return this.propertiesService.findAllApproved(queryPropertyEntityDto);
  }

  @UseGuards(JwtAuthOptionalGuard)
  @Get(':slug')
  findOne(
    @Param('slug') slug: PropertyEntity['slug'],
    @User('role') currentRole: RoleEnum,
    @User('username') currentUsername: UserEntity['username'],
  ) {
    if ([RoleEnum.Superuser, RoleEnum.Admin].includes(currentRole))
      return this.propertiesService.findOne(slug);

    if ([RoleEnum.Company].includes(currentRole))
      return this.propertiesService.findOneScopedByUser(slug, currentUsername);

    return this.propertiesService.findApprovedOne(slug);
  }

  @Auth([RoleEnum.Superuser, RoleEnum.Admin, RoleEnum.Company])
  @Patch(':slug')
  update(
    @Param('slug') slug: PropertyEntity['slug'],
    @Body() updatePropertyDto: UpdatePropertyDto,
    @User('role') currentRole: RoleEnum,
    @User('username') currentUsername: UserEntity['username'],
  ) {
    if (updatePropertyDto.slug && [RoleEnum.Company].includes(currentRole))
      throw new BadRequestException({
        message: ['Slug is not allowed.'],
      });

    return this.propertiesService.update(
      slug,
      updatePropertyDto,
      currentUsername,
      currentRole,
    );
  }

  @Auth([RoleEnum.Superuser, RoleEnum.Admin, RoleEnum.Company])
  @Delete(':slug')
  remove(
    @Param('slug') slug: string,
    @User('role') currentRole: RoleEnum,
    @User('username') currentUsername: UserEntity['username'],
  ) {
    return this.propertiesService.remove(slug, currentUsername, currentRole);
  }

  @Auth([RoleEnum.Superuser, RoleEnum.Admin])
  @Post('restore/:slug')
  restore(@Param('slug') slug: string) {
    return this.propertiesService.restore(slug);
  }
}
