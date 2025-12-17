import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersServiceModule } from 'apps/users-service/src/users-service.module';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/auth-service/.env.dev',
    }),
    UsersServiceModule,
  ],
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AuthServiceModule {}
