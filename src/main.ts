import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
app.useGlobalPipes(new ValidationPipe());

  app.enableCors(); // Utilisation de cors

const config = new DocumentBuilder()
    .setTitle('Series Connect API')
    .setDescription('The Series Connect API description')
    .setVersion('1.0')
    .addTag('Series-Connect')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
