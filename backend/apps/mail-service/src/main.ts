import { Queue } from '@app/common/constants/queues';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MailServiceModule } from './mail-service.module';

async function bootstrap() {
  const configService = new ConfigService();

  const rabbitmqUrl =
    configService.get<string>('RABBITMQ_URL') ?? 'amqp://localhost:5672';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MailServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: Queue.MAIL,
        queueOptions: { durable: false },
      },
    },
  );

  console.log('Mail Microservice is listening...');

  await app.listen();
}
bootstrap();
