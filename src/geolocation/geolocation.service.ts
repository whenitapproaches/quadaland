import { Injectable } from '@nestjs/common';

import * as geolib from 'geolib';

import { GeolibInputCoordinates } from 'geolib/es/types';

@Injectable()
export class GeolocationService {
  #geolib;

  constructor() {
    this.#geolib = geolib;
  }

  private isPointWithinRadius(
    point: GeolibInputCoordinates,
    centerPoint: GeolibInputCoordinates,
    radius: number,
  ) {
    return this.#geolib.isPointWithinRadius(point, centerPoint, radius);
  }

  private isPointInPolygon(
    point: GeolibInputCoordinates,
    polygon: GeolibInputCoordinates[],
  ) {
    return this.#geolib.isPointInPolygon(point, polygon);
  }

  isPropertyWithinRegion(
    point: GeolibInputCoordinates,
    coordinates: GeolibInputCoordinates[],
    radius?: number,
  ) {
    if (coordinates.length === 1)
      return this.isPointWithinRadius(point, coordinates[0], radius * 1000);

    return this.isPointInPolygon(point, coordinates);
  }

  getBoundaries(coordinates, radius?: number) {
    if (coordinates.length === 1) {
      const [maxY, maxX, minY, minX] = [
        { bearing: 90, field: 'longitude' },
        { bearing: 0, field: 'latitude' },
        { bearing: 270, field: 'longitude' },
        { bearing: 180, field: 'latitude' },
      ].map((axis) => {
        return this.#geolib.computeDestinationPoint(
          coordinates[0],
          radius * 1000,
          axis.bearing,
        )[axis.field];
      });
      return { maxY, maxX, minY, minX };
    }

    const latitudes = coordinates.map((coordinate) => coordinate.latitude);
    const longitudes = coordinates.map((coordinate) => coordinate.longitude);

    return {
      maxX: Math.max(...latitudes),
      minX: Math.min(...latitudes),
      maxY: Math.max(...longitudes),
      minY: Math.min(...longitudes),
    };
  }
}
