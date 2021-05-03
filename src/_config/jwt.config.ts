import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: 'qdl-2021-17t3',
}));
