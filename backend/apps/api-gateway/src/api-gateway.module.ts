import { Microservice } from '@app/common/constants/microservices';
import { Queue } from '@app/common/constants/queues';
import { JwtGuard } from '@app/common/guards/jwt.guard';
import { RolesGuard } from '@app/common/guards/roles.guard';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { BookmarksController } from './posts/bookmarks.controller';
import { BookmarksService } from './posts/bookmarks.service';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/api-gateway/.env.dev',
    }),
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
      {
        name: Microservice.AUTH,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') ??
                'amqp://localhost:5672',
            ],
            queue: Queue.AUTH,
            queueOptions: { durable: false },
          },
        }),
      },
      {
        name: Microservice.POSTS,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') ??
                'amqp://localhost:5672',
            ],
            queue: Queue.POSTS,
            queueOptions: { durable: false },
          },
        }),
      },
    ]),
  ],
  controllers: [
    UsersController,
    AuthController,
    PostsController,
    BookmarksController,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: JwtGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
    UsersService,
    AuthService,
    PostsService,
    BookmarksService,
  ],
})
export class ApiGatewayModule {}
