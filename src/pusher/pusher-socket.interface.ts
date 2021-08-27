import { RoleEnum } from 'src/roles/role.enum';
import { UserEntity } from 'src/users/entities/user.entity';

export interface PusherSocket {
  socketId: string;
  role: RoleEnum;
  username: UserEntity['username'];
}
