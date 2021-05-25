import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function ArraySizeNotEquals(
  size: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'arraySizeNotEquals',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [size],
      validator: IsCoordinateStringConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'ArraySizeNotEquals' })
export class IsCoordinateStringConstraint
  implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [size] = args.constraints;

    return value instanceof Array && value.length !== size;
  }
  defaultMessage(args: ValidationArguments) {
    return `Array of ${args.property} length must not be equal to 2.`;
  }
}
