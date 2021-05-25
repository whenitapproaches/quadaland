import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { RoleEnum } from './role.enum';

export default class CreatedRoles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const rolesCollection = [];

    for (const roleKey of Object.keys(RoleEnum)) {
      rolesCollection.push({ name: RoleEnum[roleKey] });
    }

    try {
      await connection
        .createQueryBuilder()
        .insert()
        .into(RoleEntity)
        .values(rolesCollection)
        .onConflict('DO NOTHING')
        .execute();
    } catch (err) {
      console.log(err.message);
    }
  }
}
