import { registerAs } from '@nestjs/config';
import { SwaggerCustomOptions } from '@nestjs/swagger';

const swaggerCustomOptions: SwaggerCustomOptions = {
  customSiteTitle: 'Quadaland API Documentation',
};

export default registerAs('swagger', () => ({
  title: 'Quadaland API Documentation',
  description:
    'This is details documenting the application programming interface (API) for Quadaland system. If there is any problem, please contact me.',
  version: '1.0',
  path: 'docs',
  customOptions: swaggerCustomOptions,
}));
