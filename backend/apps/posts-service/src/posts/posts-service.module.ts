import { typeormConfig } from '@app/common/config/typeorm.config';
import { Microservice } from '@app/common/constants/microservices';
import { Queue } from '@app/common/constants/queues';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarksServiceModule } from '../bookmarks/bookmarks-service.module';
import { Bookmark } from '../bookmarks/entities/bookmark.entity';
import { PostComment } from '../comments/entities/post-comment.entity';
import { PostCommentsServiceModule } from '../comments/post-comments-service.module';
import { Like } from '../entities/like.entity';
import { Post } from '../entities/post.entity';
import { PostsServiceController } from './posts-service.controller';
import { PostsServiceService } from './posts-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/posts-service/.env.dev',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeormConfig,
    }),
    TypeOrmModule.forFeature([Post, Like, Bookmark, PostComment]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? 'secret',
        signOptions: {
          expiresIn: configService.get<number>('JWT_EXPIRES_IN') ?? '86400000',
        },
      }),
    }),
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
    forwardRef(() => BookmarksServiceModule),
    forwardRef(() => PostCommentsServiceModule),
  ],
  controllers: [PostsServiceController],
  providers: [PostsServiceService],
  exports: [PostsServiceService],
})
export class PostsServiceModule {}
