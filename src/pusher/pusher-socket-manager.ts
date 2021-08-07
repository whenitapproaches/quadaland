import { Injectable } from '@nestjs/common';
import { RoleEnum } from 'src/roles/role.enum';
import { PusherSocket } from './pusher-socket.interface';

@Injectable()
export class PusherSocketManager {
  #pusherSocketOwners: Array<PusherSocket>;

  constructor() {}

  create(pusherSocket: PusherSocket) {
    return this.#pusherSocketOwners.push(pusherSocket);
  }

  getAdmins() {
    return this.#pusherSocketOwners.filter(
      (socket) => socket.role === RoleEnum.Admin,
    );
  }

  getSuperUser() {
    return this.#pusherSocketOwners.filter(
      (socket) => socket.role === RoleEnum.Superuser,
    );
  }

  getCompanies() {
    return this.#pusherSocketOwners.filter(
      (socket) => socket.role === RoleEnum.Company,
    );
  }

  getCustomers() {
    return this.#pusherSocketOwners.filter(
      (socket) => socket.role === RoleEnum.Customer,
    );
  }

  getModerators() {
    return this.#pusherSocketOwners.filter((socket) =>
      [RoleEnum.Admin, RoleEnum.Superuser].includes(socket.role),
    );
  }
}
