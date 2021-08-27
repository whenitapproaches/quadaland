import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RoleEnum } from 'src/roles/role.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CompanyRepository } from './company.repository';
import { CreateCompanyByUsernameDto } from './dto/create-company-by-username.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { QueryCompanyEntityDto } from './dto/query-company';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyEntity } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const company = await this.companyRepository.create(createCompanyDto);

    return this.companyRepository.save(company);
  }

  async findByUsername(
    username: UserEntity['username'],
  ): Promise<CompanyEntity> {
    const company = await this.companyRepository
      .createQueryBuilder('company')
      .withDeleted()
      .leftJoinAndSelect('company.user', 'user', 'company.user is not null')
      .where('user.username = :username', { username })
      .getOne();

    return company;
  }

  async restore(username: UserEntity['username']) {
    const company = await this.findByUsername(username);

    if (!company) return;

    await this.companyRepository.restore({ id: company.id });
  }

  async createByUsername(
    createCompanyByUsernameDto: CreateCompanyByUsernameDto,
  ) {
    const user = await this.usersService.findOneOrFail(
      createCompanyByUsernameDto.username,
    );

    const doesCompanyByUsernameExist = !!(await this.findByUsername(
      createCompanyByUsernameDto.username,
    ));

    if (doesCompanyByUsernameExist)
      throw new UnprocessableEntityException({
        message: 'not_allowed.create.duplicated_company_by_username',
      });

    if (user.role.name !== RoleEnum.Company) {
      throw new ForbiddenException({
        message: 'not_allowed.user.not_company',
      });
    }

    const company = await this.companyRepository.create({
      ...createCompanyByUsernameDto,
      user,
    });

    return this.companyRepository.save(company);
  }

  async findAll(queryCompanyEntityDto: QueryCompanyEntityDto) {
    return await this.companyRepository.findByQueriesWithCondition(
      queryCompanyEntityDto,
      {},
      { withDeleted: true },
    );
  }

  async findOne(username: UserEntity['username']) {
    const company = await this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.user', 'user', 'company.user is not null')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .leftJoinAndSelect('avatar.media', 'media_avatar')
      .andWhere('user.username = :username', { username })
      .getOne();

    if (!company)
      throw new NotFoundException({
        message: 'not_found.read.company',
      });

    return company;
  }

  async findOneWithMedia(username: UserEntity['username']) {
    const company = await this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.user', 'user', 'company.user is not null')
      .leftJoinAndSelect('company.media', 'media')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .leftJoinAndSelect('avatar.media', 'media_avatar')
      .andWhere('user.username = :username', { username })
      .getOne();

    if (!company)
      throw new NotFoundException({
        message: 'not_found.read.company',
      });

    return company;
  }

  async update(
    username: UserEntity['username'],
    updateCompanyDto: UpdateCompanyDto,
  ) {
    const company = await this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.user', 'user')
      .andWhere('user.username = :username', { username })
      .getOne();

    if (!company) throw new NotFoundException();

    const resultCompany = await this.companyRepository.merge(
      company,
      updateCompanyDto,
    );

    await this.companyRepository.save(resultCompany);

    return resultCompany;
  }

  async remove(username: UserEntity['username']) {
    const company = await this.findByUsername(username);

    if (!company) return;

    await this.companyRepository.softDelete({ id: company.id });
  }
}
