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
import { CustomerRepository } from './customer.repository';
import { CreateCustomerByUsernameDto } from './dto/create-customer-by-username.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { QueryCustomerEntityDto } from './dto/query-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerEntity } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const customer = await this.customerRepository.create(createCustomerDto);

    return this.customerRepository.save(customer);
  }

  async findByEmail(email: CustomerEntity['email']): Promise<CustomerEntity> {
    const customer = await this.customerRepository
      .createQueryBuilder('customer')
      .withDeleted()
      .leftJoinAndSelect('customer.user', 'user', 'customer.user is not null')
      .where('customer.email = :email', { email })
      .getOne();
    return customer;
  }

  async findByUsername(
    username: UserEntity['username'],
  ): Promise<CustomerEntity> {
    const customer = await this.customerRepository
      .createQueryBuilder('customer')
      .withDeleted()
      .leftJoinAndSelect('customer.user', 'user', 'customer.user is not null')
      .where('user.username = :username', { username })
      .getOne();

    return customer;
  }

  async restore(username: UserEntity['username']) {
    const customer = await this.findByUsername(username);

    if (!customer) return;

    await this.customerRepository.restore({ id: customer.id });
  }

  async createByUsername(
    createCustomerByUsernameDto: CreateCustomerByUsernameDto,
  ) {
    const user = await this.usersService.findOneOrFail(
      createCustomerByUsernameDto.username,
    );

    const doesCustomerByUsernameExist = !!(await this.findByUsername(
      createCustomerByUsernameDto.username,
    ));

    if (doesCustomerByUsernameExist)
      throw new UnprocessableEntityException({
        message: 'not_allowed.create.duplicated_customer_by_username',
      });

    if (user.role.name !== RoleEnum.Customer) {
      throw new ForbiddenException({
        message: 'not_allowed.user.not_customer',
      });
    }

    const customer = await this.customerRepository.create({
      ...createCustomerByUsernameDto,
      user,
    });

    return this.customerRepository.save(customer);
  }

  async findAll(queryCustomerEntityDto: QueryCustomerEntityDto) {
    return await this.customerRepository.findByQueriesWithCondition(
      queryCustomerEntityDto,
      {},
      { withDeleted: true },
    );
  }

  async findOne(username: UserEntity['username']) {
    const customer = await this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.user', 'user', 'customer.user is not null')
      .andWhere('user.username = :username', { username })
      .getOne();

    if (!customer)
      throw new NotFoundException({
        message: 'not_found.read.customer',
      });

    return customer;
  }

  async update(
    username: UserEntity['username'],
    updateCustomerDto: UpdateCustomerDto,
  ) {
    const customer = await this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.user', 'user')
      .andWhere('user.username = :username', { username })
      .getOne();

    if (!customer) throw new NotFoundException();

    const resultCustomer = await this.customerRepository.merge(
      customer,
      updateCustomerDto,
    );

    await this.customerRepository.save(resultCustomer);

    return resultCustomer;
  }

  async remove(username: UserEntity['username']) {
    const customer = await this.findByUsername(username);

    if (!customer) return;

    await this.customerRepository.softDelete({ id: customer.id });
  }
}
