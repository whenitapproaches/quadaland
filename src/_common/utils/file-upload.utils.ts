import { UnprocessableEntityException } from '@nestjs/common';
import { isIn } from 'class-validator';
import { extname } from 'path';
import { nanoid } from 'nanoid';

const allowedFileTypes = ['video/mp4', 'image/jpeg'];

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|mp4)$/)) {
    return callback(
      new UnprocessableEntityException({
        message: 'Only files with extensions: jpg, jpeg, mp4 are allowed!',
      }),
      false,
    );
  }

  const isInAllowedFileTypes = isIn(file.mimetype, allowedFileTypes);
  if (!isInAllowedFileTypes)
    return callback(
      new UnprocessableEntityException({
        message: `Only file types of ${allowedFileTypes.join(
          ', ',
        )} are allowed`,
      }),
      false,
    );

  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = nanoid(10);
  callback(null, `${name}-${randomName}${fileExtName}`);
};
