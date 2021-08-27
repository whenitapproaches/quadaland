import { registerAs } from '@nestjs/config';

import * as dotenv from 'dotenv';

dotenv.config();

const {
  MAIL_SERVICE,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASSWORD,
} = process.env;

export default registerAs('mail', () => ({
  service: MAIL_SERVICE || 'gmail',
  host: MAIL_HOST || 'smtp.gmail.com',
  port: MAIL_PORT || 587,
  secure: false,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
}));
