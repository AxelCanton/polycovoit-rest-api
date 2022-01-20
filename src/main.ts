import {
  ClassSerializerInterceptor,
  NestInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import validationConfig from './config/config.validation';
import { ValidUserGuard } from './utils/guards/validUser.guard';
import { RequestLoggerInterceptor } from './utils/requestLogger.interceptor';
import { RolesGuard } from './utils/roles/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('PolyCovoit API Documentation')
    .setDescription('A swagger documentation to explain all the routes')
    .build();

  // Swagger doc
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Add guards, interceptor, and pipes
  const reflector = app.get(Reflector);
  const globalInterceptors: NestInterceptor[] = [];

  if (process.env.MODE && process.env.MODE === 'DEV') {
    globalInterceptors.push(new RequestLoggerInterceptor());
  }
  globalInterceptors.push(new ClassSerializerInterceptor(reflector));

  app.useGlobalPipes(new ValidationPipe(validationConfig));
  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    new RolesGuard(reflector),
    new ValidUserGuard(reflector),
  ); // JwtAuthGuard must be executed before every other guards (because they used what it returns)
  app.useGlobalInterceptors(...globalInterceptors);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000',
  });

  await app.listen(process.env.SERVER_PORT || 5000);
}
bootstrap();
