import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default (app, swaggerConfigs) => {
  const documentBuilderConfig = new DocumentBuilder()
    .setTitle(swaggerConfigs['title'])
    .setDescription(swaggerConfigs['description'])
    .setVersion(swaggerConfigs['version'])
    .build();
  const document = SwaggerModule.createDocument(app, documentBuilderConfig);

  SwaggerModule.setup(
    swaggerConfigs['path'],
    app,
    document,
    swaggerConfigs['customOptions'],
  );
};
