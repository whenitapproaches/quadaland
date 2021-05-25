import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PropertyCreatedEvent } from '../events/property-created.event';

@Injectable()
export class PropertyListener {
  @OnEvent('property.created')
  handlePropertyCreatedEvent(event: PropertyCreatedEvent) {
    console.log(event);
  }
}
