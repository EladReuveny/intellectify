import { typeormConfig } from '@app/common/config/typeorm.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersServiceController } from './users-service.controller';
import { UsersServiceService } from './users-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/users-service/.env.dev',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeormConfig,
    }),
    TypeOrmModule.forFeature([User]),
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
  ],
  controllers: [UsersServiceController],
  providers: [UsersServiceService],
  exports: [UsersServiceService],
})
export class UsersServiceModule {}
