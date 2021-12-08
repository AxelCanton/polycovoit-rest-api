import { ClassSerializerInterceptor, NestInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { env } from 'process';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import validationConfig from './config/config.validation';
import { RequestLoggerInterceptor } from './utils/requestLogger.interceptor';
import { RolesGuard } from './utils/roles/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('PolyCovoit API Documentation')
  .setDescription('A swagger documentation to explain all the routes')
  .build();

  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api', app, document);

  const reflector = app.get( Reflector );
  const globalInterceptors: NestInterceptor[] = [];
  
  if(process.env.MODE && process.env.MODE === 'DEV') {
    globalInterceptors.push(new RequestLoggerInterceptor())
  }
  globalInterceptors.push(new ClassSerializerInterceptor(reflector))

  app.useGlobalPipes(new ValidationPipe(validationConfig));
  app.useGlobalGuards(new JwtAuthGuard(reflector),new RolesGuard(reflector)); // JwtAuthGuard must be executed before RolesGuard (the latter uses the former to validate)
  app.useGlobalInterceptors(...globalInterceptors);

  await app.listen(process.env.SERVER_PORT || 5000);
}
bootstrap();
