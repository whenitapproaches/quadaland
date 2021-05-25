import { registerAs } from '@nestjs/config';

import * as dotenv from 'dotenv';

dotenv.config();

const { JWT_SECRET } = process.env;

export default registerAs('jwt', () => ({
  secret: JWT_SECRET,
  expiresIn: '30m',
}));
