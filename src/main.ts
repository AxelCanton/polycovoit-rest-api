import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config =new DocumentBuilder()
  .setTitle('PolyCovoit API Documentation')
  .setDescription('A swagger documentation to explain all the routes')
  .build();

  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
