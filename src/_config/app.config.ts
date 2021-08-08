import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: 2999,
  api: {
    version: 'v1',
  },
}));
