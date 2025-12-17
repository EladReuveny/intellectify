import { SwaggerConfig } from '@app/common/config/swagger.config';
import { LoggerMiddleware } from '@app/common/middlewares/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('NODE_ENV', 'dev');
  const port = configService.get<number>('PORT', 3000);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  const apiVersion = configService.get<string>('API_VERSION', 'v1');

  app.enableCors();
  app.setGlobalPrefix(apiPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // app.useGlobalFilters(new GlobalExceptionFilter());

  if (nodeEnv !== 'prod') {
    app.use(new LoggerMiddleware().use);
  }

  const documentFactory = () =>
    SwaggerModule.createDocument(app, SwaggerConfig(apiVersion));
  SwaggerModule.setup(`${apiPrefix}/docs`, app, documentFactory(), {
    jsonDocumentUrl: `${apiPrefix}/docs.json`,
  });

  await app.listen(port, () => {
    console.log(
      `Server running on port ${port} on URL: http://localhost:${port}/${apiPrefix}`,
    );
  });
}

bootstrap();
