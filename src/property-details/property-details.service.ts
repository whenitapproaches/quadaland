import { Injectable } from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { MediaService } from 'src/media/media.service';
import { Connection } from 'typeorm';
import { CreatePropertyDetailDto } from './dto/create-property-detail.dto';
import { UpdatePropertyDetailDto } from './dto/update-property-detail.dto';
import { PropertyDetailEntity } from './entities/property-detail.entity';
import { PropertyDetailRepository } from './property-detail.repository';

@Injectable()
export class PropertyDetailsService {
  constructor(
    private readonly propertyDetailRepository: PropertyDetailRepository,
    private readonly mediaService: MediaService,
    private readonly connection: Connection,
  ) {}

  async create(createPropertyDetailDto: CreatePropertyDetailDto) {
    const createPropertyDetailObject = classToPlain(createPropertyDetailDto);

    const details = await this.propertyDetailRepository.create(
      createPropertyDetailObject,
    );

    if (createPropertyDetailDto.media) {
      const media = await this.mediaService.findAllBySlugs(
        createPropertyDetailDto.media,
      );

      details.media = media;
    }

    return this.propertyDetailRepository.save(details);
  }

  async update(
    propertyDetail: PropertyDetailEntity,
    updatePropertyDetailDto: UpdatePropertyDetailDto,
  ) {
    const updatePropertyDetailObject = classToPlain(updatePropertyDetailDto);

    const updatedPropertyDetail = await this.propertyDetailRepository.merge(
      propertyDetail,
      updatePropertyDetailObject,
    );

    if (updatePropertyDetailDto.media) {
      const media = await this.mediaService.findAllBySlugs(
        updatePropertyDetailDto.media,
      );

      updatedPropertyDetail.media = media;
    }

    await this.propertyDetailRepository.save(updatedPropertyDetail);

    return updatedPropertyDetail;
  }

  remove(id: number) {
    return `This action removes a #${id} propertyDetail`;
  }
}
