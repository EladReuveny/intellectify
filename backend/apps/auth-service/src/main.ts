import { Queue } from '@app/common/constants/constants';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const configService = new ConfigService();

  const rabbitmqUrl =
    configService.get<string>('RABBITMQ_URL') ?? 'amqp://localhost:5672';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: Queue.AUTH_QUEUE,
        queueOptions: { durable: false },
      },
    },
  );

  console.log('Auth Microservice is listening...');

  await app.listen();
}
bootstrap();
