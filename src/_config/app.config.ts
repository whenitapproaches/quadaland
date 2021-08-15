import { registerAs } from '@nestjs/config';

import * as dotenv from 'dotenv';

dotenv.config();

const { FRONT_SITE_URL, AUTH_KEY } = process.env;

export default registerAs('app', () => ({
  port: 3000,
  api: {
    version: 'v1',
  },
  urls: {
    front_site: FRONT_SITE_URL,
  },
  keys: {
    auth: AUTH_KEY,
  },
  activation: {
    expiresIn: '5m',
  },
}));
