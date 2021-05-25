import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyDetailRepository } from './property-detail.repository';
import { PropertyDetailsService } from './property-details.service';
import { PropertyDetailsController } from './property-details.controller';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyDetailRepository]), MediaModule],
  providers: [PropertyDetailsService],
  exports: [PropertyDetailsService],
  controllers: [PropertyDetailsController],
})
export class PropertyDetailsModule {}
