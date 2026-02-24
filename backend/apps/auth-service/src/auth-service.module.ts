import { Microservice } from '@app/common/constants/microservices';
import { Queue } from '@app/common/constants/queues';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersServiceModule } from 'apps/users-service/src/users-service.module';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/auth-service/.env.dev',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        signOptions: {
          expiresIn:
            configService.get<string>('JWT_RESET_TOKEN_EXPIRATION') ??
            ('15m' as any),
        },
        secret: configService.get<string>('JWT_RESET_TOKEN_SECRET'),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: Microservice.MAIL,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') ??
                'amqp://localhost:5672',
            ],
            queue: Queue.MAIL,
            queueOptions: { durable: false },
          },
        }),
      },
    ]),
    UsersServiceModule,
  ],
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AuthServiceModule {}
