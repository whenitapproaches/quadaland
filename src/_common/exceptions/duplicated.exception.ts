import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicatedException extends HttpException {
  constructor({ message } = { message: 'Duplicated' }) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
