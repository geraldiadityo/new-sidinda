import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import * as fastifyCookie from '@fastify/cookie';
// const fastifyCookie = require('@fastify/cookie').default;
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET','POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: true
  });
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  const configService = app.get(ConfigService);
  await app.register(fastifyCookie.default as any, {
    secret: configService.get<string>('FASTIFY_COOKIE')
  });
  app.enableShutdownHooks();
  await app.listen(configService.get('PORT'));
  logger.log(`Backend Service running on port ${configService.get('PORT')}`, 'Bootstrap',{context: 'Bootstrap'})
}
bootstrap();
