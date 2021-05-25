import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  matches,
  isLatitude,
  isLongitude,
} from 'class-validator';

export function IsCoordinateString(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isCoordinateString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsCoordinateStringConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsCoordinateString' })
export class IsCoordinateStringConstraint
  implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return (
      matches(value, /[0-9.]+,[0-9.]+/g) &&
      isLatitude(value.split(',')[0]) &&
      isLongitude(value.split(',')[1])
    );
  }
  defaultMessage(args: ValidationArguments) {
    return 'Coordinates must follow format {latitude,longitude}';
  }
}
