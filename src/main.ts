import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  app.setGlobalPrefix('api/v1');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Flight Booking API')
    .setDescription('API for flight booking system')
    .setVersion('1.0')
    .addTag('flights', 'Flight management operations')
    .addTag('bookings', 'Booking management operations')
    .addTag('users', 'User management operations')
    .addTag('airports', 'Airport management operations')
    .addTag('seats', 'Seat management operations')
    .addTag('payments', 'Payment management operations')
    .addTag('notifications', 'Notification management operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));
  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`Swagger UI is available at: ${await app.getUrl()}/api/docs`);
}
bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
