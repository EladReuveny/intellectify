import { Queue } from '@app/common/constants/queues';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UsersServiceModule } from './users-service.module';
async function bootstrap() {
  const configService = new ConfigService();
  const rabbitmqUrl =
    configService.get<string>('RABBITMQ_URL') ?? 'amqp://localhost:5672';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: Queue.USERS,
        queueOptions: { durable: false },
      },
    },
  );

  console.log('Users Microservice is listening...');

  await app.listen();
}
bootstrap();
