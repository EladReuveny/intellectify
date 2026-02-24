import { MailPattern } from '@app/common/constants/patterns/mail.pattern';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MailServiceService } from './mail-service.service';

@Controller()
export class MailServiceController {
  constructor(private readonly mailServiceService: MailServiceService) {}

  @EventPattern(MailPattern.events.SEND_RESET_PASSWORD_EMAIL)
  sendResetPasswordEmail(
    @Payload() { email, token }: { email: string; token: string },
  ) {
    this.mailServiceService.sendResetPasswordEmail(email, token);
  }

  @EventPattern(MailPattern.events.SEND_RESET_PASSWORD_CONFIRMATION_EMAIL)
  sendResetPasswordConfirmationEmail(@Payload() { email }: { email: string }) {
    this.mailServiceService.sendResetPasswordConfirmationEmail(email);
  }
}
