import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailServiceController } from './mail-service.controller';
import { MailServiceService } from './mail-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/mail-service/.env.dev',
    }),
  ],
  controllers: [MailServiceController],
  providers: [MailServiceService],
  exports: [MailServiceService],
})
export class MailServiceModule {}
