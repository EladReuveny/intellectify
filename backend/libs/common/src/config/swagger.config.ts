import { DocumentBuilder } from '@nestjs/swagger';
export const SwaggerConfig = (version: string) => {
  return new DocumentBuilder()
    .setTitle('Intellectify API Docs')
    .setDescription('Comprehensive API documentation')
    .setVersion(version)
    .addTag('App', 'Application APIs')
    .addTag('Auth', 'Authentication and Authorization APIs')
    .addTag('Users', 'Users APIs')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
        description: 'Enter JWT token as: Bearer {token}',
      },
      'jwtAccessToken',
    )
    .build();
};
