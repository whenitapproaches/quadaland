import { registerAs } from '@nestjs/config';

export default registerAs('rate-limiting', () => ({
  ttl: 60,
  limit: 100,
  testing: {
    access_key: '4423FDFE4692DFED7EFF54DE35EDA',
    ttl: 60,
    limit: 80,
  },
}));
