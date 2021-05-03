import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  private async existByUsername(
    username: UserEntity['username'],
  ): Promise<boolean> {
    const existingUser = await this.findOne(username);
    return !!existingUser;
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    if (await this.existByUsername(createUserDto.username)) {
      throw new HttpException('user.existed', HttpStatus.NOT_FOUND);
    }

    const savedUser = await this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(savedUser);
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(username: UserEntity['username']) {
    return await this.usersRepository.findOne({ username });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
