import { Injectable } from '@nestjs/common';
import { RoleEnum } from './role.enum';
import { RoleRepository } from './role.repository';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async findOne(role: RoleEnum) {
    return await this.roleRepository.findOne({
      name: role,
    });
  }

  async findAll() {
    return await this.roleRepository.find();
  }
}
