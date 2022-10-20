// eslint-disable-next-line @typescript-eslint/no-unused-vars
import newrelic from 'newrelic';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NewrelicInterceptor } from './@shared/interceptor/new-relic.interceptor';
import { AppModule } from './app.module';
import { NrLogger } from './@shared/logger/nr-logger.logger';
import { HttpExceptionFilter } from './@shared/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useLogger(new NrLogger());
  app.useGlobalInterceptors(new NewrelicInterceptor());

  const config = new DocumentBuilder()
    .setTitle('E-commerce')
    .setDescription('The ecommerce API description')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  app.useGlobalFilters(new HttpExceptionFilter());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(3000);
}
bootstrap();
