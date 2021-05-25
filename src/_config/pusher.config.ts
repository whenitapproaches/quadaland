import { registerAs } from '@nestjs/config';

import * as dotenv from 'dotenv';

dotenv.config();

const {
  PUSHER_APP_KEY,
  PUSHER_APP_SECRET,
  PUSHER_APP_ID,
  PUSHER_CLUSTER,
} = process.env;

export default registerAs('pusher', () => ({
  appId: PUSHER_APP_KEY,
  key: PUSHER_APP_SECRET,
  secret: PUSHER_APP_ID,
  cluster: PUSHER_CLUSTER,
  useTLS: true,
}));
