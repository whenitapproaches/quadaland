import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicatedException extends HttpException {
  constructor() {
    super('Duplicated', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
