import { Microservice, Queue } from '@app/common/constants/constants';
import { JwtGuard } from '@app/common/guards/jwt.guard';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { RolesGuard } from '@app/common/guards/roles.guard';

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
        name: Microservice.USERS_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') ??
                'amqp://localhost:5672',
            ],
            queue: Queue.USERS_QUEUE,
            queueOptions: { durable: false },
          },
        }),
      },
      {
        name: Microservice.AUTH_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') ??
                'amqp://localhost:5672',
            ],
            queue: Queue.AUTH_QUEUE,
            queueOptions: { durable: false },
          },
        }),
      },
    ]),
  ],
  controllers: [UsersController, AuthController],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: JwtGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard
    },
    UsersService,
    AuthService,
  ],
})
export class ApiGatewayModule {}
