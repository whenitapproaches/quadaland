import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleEnum } from 'src/roles/role.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { User } from 'src/users/user.decorator';
import { CompaniesService } from './companies.service';
import { CreateCompanyByUsernameDto } from './dto/create-company-by-username.dto';
import { QueryCompanyEntityDto } from './dto/query-company';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Auth([RoleEnum.Superuser, RoleEnum.Admin])
  @Post()
  create(@Body() createCompanyByUsernameDto: CreateCompanyByUsernameDto) {
    return this.companiesService.createByUsername(createCompanyByUsernameDto);
  }

  @Auth([RoleEnum.Superuser, RoleEnum.Admin])
  @Get()
  findAll(@Query() queryCompanyEntityDto: QueryCompanyEntityDto) {
    return this.companiesService.findAll(queryCompanyEntityDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  findOne(@Param('username') username: UserEntity['username']) {
    return this.companiesService.findOne(username);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':username')
  update(
    @Param('username') username: UserEntity['username'],
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User('username') currentUsername: UserEntity['username'],
    @User('role') currentRole: RoleEnum,
  ) {
    if (
      currentUsername !== username &&
      [RoleEnum.Company, RoleEnum.Customer].includes(currentRole)
    )
      throw new ForbiddenException({
        message: 'not_allowed.update.other_company',
      });

    return this.companiesService.update(username, updateCompanyDto);
  }
}
