import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import * as moment from 'moment-timezone';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  // app.use(cookieParser());
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    methods: '*',
  });
  app.setGlobalPrefix('api');
  const currentTimezone = moment.tz.guess();
  console.log('Current Timezone:', currentTimezone);
  await app.listen(4000);
}
bootstrap();
