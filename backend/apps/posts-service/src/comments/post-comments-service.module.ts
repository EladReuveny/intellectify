import { Microservice } from '@app/common/constants/microservices';
import { Queue } from '@app/common/constants/queues';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from '../entities/like.entity';
import { PostsServiceModule } from '../posts/posts-service.module';
import { PostComment } from './entities/post-comment.entity';
import { PostCommentsServiceController } from './post-comments-service.controller';
import { PostCommentsServiceService } from './post-comments-service.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostComment, Like]),
    forwardRef(() => PostsServiceModule),
    ClientsModule.registerAsync([
      {
        name: Microservice.USERS,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') ??
                'amqp://localhost:5672',
            ],
            queue: Queue.USERS,
            queueOptions: { durable: false },
          },
        }),
      },
    ]),
  ],
  controllers: [PostCommentsServiceController],
  providers: [PostCommentsServiceService],
  exports: [],
})
export class PostCommentsServiceModule {}
