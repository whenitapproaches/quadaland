import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyRepository } from './property.repository';
import slugify from 'slugify';
import { PropertyDetailsService } from 'src/property-details/property-details.service';
import { PropertySaleMethodsService } from 'src/property-sale-methods/property-sale-methods.service';
import { CompaniesService } from 'src/companies/companies.service';
import { PropertyDetailEntity } from 'src/property-details/entities/property-detail.entity';
import { PropertyEntity } from './entities/property.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { RoleEnum } from 'src/roles/role.enum';
import { QueryPropertyEntityDto } from './dto/query-property.dto';
import { GeolocationService } from 'src/geolocation/geolocation.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PropertyCreatedEvent } from './events/property-created.event';
import { NotificationTypeEnum } from 'src/notifications/notification-type.enum';
import { TargetTypes } from 'src/notifications/interfaces/notification-target.interface';

@Injectable()
export class PropertiesService {
  constructor(
    private readonly propertyRepository: PropertyRepository,
    private readonly propertyDetailsService: PropertyDetailsService,
    private readonly propertySaleMethodsService: PropertySaleMethodsService,
    private readonly companiesService: CompaniesService,
    private readonly geolocationService: GeolocationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  slugify(title) {
    return slugify(title, {
      lower: true,
      locale: 'vi',
    });
  }

  async existBySlug(slug) {
    const property = await this.propertyRepository.findOne(
      {
        slug,
      },
      {
        withDeleted: true,
      },
    );

    return !!property;
  }

  async generateSlug(title: PropertyDetailEntity['title']) {
    const baseSlug = this.slugify(title);

    let slug = baseSlug;

    while (await this.existBySlug(slug)) {
      slug = baseSlug + '-' + Math.round(Math.random() * 100000);
    }

    return slug;
  }

  async create(createPropertyDto: CreatePropertyDto) {
    const slug = await this.generateSlug(createPropertyDto.details.title);

    const {
      details,
      sale_method: saleMethod,
      ...propertyObject
    } = createPropertyDto;

    const propertyDetails = await this.propertyDetailsService.create(details);

    const propertySaleMethod = await this.propertySaleMethodsService.findOneOrFail(
      saleMethod,
    );

    const property = await this.propertyRepository.create(propertyObject);

    property.sale_method = propertySaleMethod;

    property.details = propertyDetails;

    property.slug = slug;

    return property;
  }

  private emitPropertyCreatedEvent(payload: PropertyCreatedEvent) {
    return this.eventEmitter.emit('property.created', payload);
  }

  async createByAdmin(createPropertyDto: CreatePropertyDto) {
    const property = await this.create(createPropertyDto);

    property.approval_status = true;

    const savedProperty = await this.propertyRepository.save(property);

    const propertyCreatedEvent = new PropertyCreatedEvent();

    propertyCreatedEvent.notification.type =
      NotificationTypeEnum.AdminPostingProperty;

    propertyCreatedEvent.notification.target.id = savedProperty.slug;
    propertyCreatedEvent.notification.target.type = TargetTypes.Property;

    await this.emitPropertyCreatedEvent(propertyCreatedEvent);

    return savedProperty;
  }

  async createByCompany(createPropertyDto: CreatePropertyDto, currentUsername) {
    if (createPropertyDto.slug) {
      throw new BadRequestException({
        message: ['Slug is not allowed.'],
      });
    }

    const property = await this.create(createPropertyDto);

    const company = await this.companiesService.findByUsername(currentUsername);

    property.company = company;

    const savedProperty = await this.propertyRepository.save(property);

    const propertyCreatedEvent = new PropertyCreatedEvent();

    propertyCreatedEvent.notification.type =
      NotificationTypeEnum.AdminPostingProperty;

    propertyCreatedEvent.notification.object = savedProperty.company.full_name;

    propertyCreatedEvent.notification.target.id = savedProperty.slug;
    propertyCreatedEvent.notification.target.type = TargetTypes.Property;

    await this.emitPropertyCreatedEvent(propertyCreatedEvent);

    return savedProperty;
  }

  findByCoordinates(queryPropertyEntityDto: QueryPropertyEntityDto) {
    return this.propertyRepository.findByCoordinates(
      queryPropertyEntityDto,
      this.geolocationService,
    );
  }

  findAll(queryPropertyEntityDto: QueryPropertyEntityDto) {
    return this.propertyRepository.findByQueriesWithCondition(
      queryPropertyEntityDto,
      {},
      {
        withDeleted: true,
      },
    );
  }

  findAllApproved(queryPropertyEntityDto: QueryPropertyEntityDto) {
    return this.propertyRepository.findByQueriesWithCondition(
      queryPropertyEntityDto,
      {
        is_approved: true,
      },
      {
        withDeleted: false,
      },
    );
  }

  findAllByCompany(
    queryPropertyEntityDto: QueryPropertyEntityDto,
    currentUsername,
  ) {
    return this.propertyRepository.findByQueriesWithCondition(
      queryPropertyEntityDto,
      {
        byCompany: currentUsername,
        is_approved: true,
      },
      {
        withDeleted: false,
      },
    );
  }

  async update(
    slug: PropertyEntity['slug'],
    updatePropertyDto: UpdatePropertyDto,
    currentUsername: UserEntity['username'],
    currentRole: RoleEnum,
  ) {
    if (updatePropertyDto.slug) {
      if (await this.existBySlug(updatePropertyDto.slug))
        throw new UnprocessableEntityException({
          message: 'duplicated.slug',
        });
    }

    const property = await this.propertyRepository.findOne({
      where: { slug },
      relations: ['company', 'company.user', 'details', 'sale_method'],
      withDeleted: true,
    });

    if (!property)
      throw new NotFoundException({
        message: 'not_found.read.property',
      });

    if (
      property &&
      property.company === null &&
      [RoleEnum.Company].includes(currentRole)
    )
      throw new ForbiddenException({
        message: 'not_allowed.update.other_owner_property',
      });

    if (
      property &&
      property.company &&
      property.company.user.username !== currentUsername &&
      [RoleEnum.Company].includes(currentRole)
    )
      throw new ForbiddenException({
        message: 'not_allowed.update.other_company_property',
      });

    const updatePropertyObject = classToPlain(updatePropertyDto);

    let updatedProperty = await this.propertyRepository.merge(
      property,
      updatePropertyObject,
    );

    if (updatePropertyDto.details) {
      const propertyDetails = property.details;
      if (updatePropertyDto.details.title) {
        const slug = await this.generateSlug(updatePropertyDto.details.title);
        updatedProperty = await this.propertyRepository.merge(updatedProperty, {
          slug,
        });
      }

      const updatedPropertyDetail = await this.propertyDetailsService.update(
        propertyDetails,
        updatePropertyDto.details,
      );
      updatedProperty = await this.propertyRepository.merge(updatedProperty, {
        details: updatedPropertyDetail,
      });
    }

    if (updatePropertyDto.sale_method) {
      const propertySaleMethod = await this.propertySaleMethodsService.findOneOrFail(
        updatePropertyDto.sale_method,
      );
      updatedProperty = await this.propertyRepository.merge(updatedProperty, {
        sale_method: propertySaleMethod,
      });
    }

    const savedProperty = await this.propertyRepository.save(updatedProperty);

    if (savedProperty.approval_status !== updatePropertyDto.approval_status) {
      this.eventEmitter.emit('');
    }

    return savedProperty;
  }

  async remove(
    slug: PropertyEntity['slug'],
    currentUsername: UserEntity['username'],
    currentRole: RoleEnum,
  ) {
    const property = await this.propertyRepository.findOne(
      {
        slug,
      },
      {
        relations: ['company', 'company.user', 'details', 'sale_method'],
      },
    );

    if (!property)
      throw new NotFoundException({
        message: 'not_found.read.property',
      });

    if (
      property &&
      property.company === null &&
      [RoleEnum.Company].includes(currentRole)
    )
      throw new ForbiddenException({
        message: 'not_allowed.delete.other_owner_property',
      });

    if (
      property &&
      property.company &&
      property.company.user.username !== currentUsername &&
      [RoleEnum.Company].includes(currentRole)
    )
      throw new ForbiddenException({
        message: 'not_allowed.delete.other_company_property',
      });

    await this.propertyRepository.softDelete({ slug });

    return {
      success: true,
    };
  }

  async restore(slug: PropertyEntity['slug']) {
    const property = await this.propertyRepository.findOne(
      {
        slug,
      },
      {
        relations: [
          'company',
          'company.user',
          'details',
          'sale_method',
          'details.media',
        ],
        withDeleted: true,
      },
    );

    if (!property)
      throw new NotFoundException({
        message: 'not_found.read.property',
      });

    await this.propertyRepository.restore({ slug });

    return {
      success: true,
    };
  }

  async findOne(slug) {
    const property = await this.propertyRepository.findOne({
      where: { slug },
      relations: [
        'company',
        'company.user',
        'details',
        'sale_method',
        'details.media',
      ],
    });

    return classToPlain(property);
  }

  async findApprovedOne(slug) {
    const property = await this.propertyRepository.findOne({
      where: { slug, approval_status: true },
      relations: [
        'company',
        'company.user',
        'details',
        'sale_method',
        'details.media',
      ],
    });

    if (!property)
      throw new NotFoundException({
        message: 'not_found.read.property',
      });

    return classToPlain(property);
  }

  async findOneScopedByUser(slug, currentUsername) {
    const property = await this.propertyRepository.findOne({
      where: { slug },
      relations: [
        'company',
        'company.user',
        'details',
        'sale_method',
        'details.media',
      ],
      withDeleted: true,
    });

    if (!property)
      throw new NotFoundException({
        message: 'not_found.read.property',
      });

    if (!property.approval_status && property.company === null)
      throw new ForbiddenException({
        message: 'not_allowed.read.other_owner_property',
      });

    if (
      !property.approval_status &&
      property.company.user.username !== currentUsername
    )
      throw new ForbiddenException({
        message: 'not_allowed.read.other_company_property',
      });

    return classToPlain(property);
  }
}
