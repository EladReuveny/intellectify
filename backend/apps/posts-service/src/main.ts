import { Queue } from '@app/common/constants/queues';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PostsServiceModule } from './posts/posts-service.module';
async function bootstrap() {
  const configService = new ConfigService();
  const rabbitmqUrl =
    configService.get<string>('RABBITMQ_URL') ?? 'amqp://localhost:5672';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PostsServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: Queue.POSTS,
        queueOptions: { durable: false },
      },
    },
  );

  console.log('Posts Microservice is listening...');

  await app.listen();
}
bootstrap();
