import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // adding this whitelist:true ensure that any extra properties in the body will not pass to the controller
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Egyptian Premier League')
    .setDescription('Egyptian Premier League API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token must be admin',
        in: 'header',
      },
      'JWT-auth-admin',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token must be manager',
        in: 'header',
      },
      'JWT-auth-manager',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: ['http://localhost:4000'],
    methods: ['POST', 'PUT', 'DELETE', 'GET'],
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
