import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { PropertySaleMethodsEnum } from './property-sale-methods.enum';
import { PropertySaleMethodEntity } from './entities/property-sale-method.entity';

export default class CreatePropertySaleMethods implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const propertySaleMethodsCollection = [];

    for (const roleKey of Object.keys(PropertySaleMethodsEnum)) {
      propertySaleMethodsCollection.push({
        name: PropertySaleMethodsEnum[roleKey],
      });
    }

    try {
      await connection
        .createQueryBuilder()
        .insert()
        .into(PropertySaleMethodEntity)
        .values(propertySaleMethodsCollection)
        .onConflict('DO NOTHING')
        .execute();
    } catch (err) {
      console.log(err.message);
    }
  }
}
