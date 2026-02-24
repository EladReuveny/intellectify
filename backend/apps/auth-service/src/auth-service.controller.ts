import { AuthPattern } from '@app/common/constants/patterns/auth.pattern';
import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from 'apps/auth-service/src/dto/create-user.dto';
import { LoginUserDto } from 'apps/auth-service/src/dto/login-user.dto';
import { AuthServiceService } from './auth-service.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';

@Controller()
export class AuthServiceController {
  constructor(
    private readonly authServiceService: AuthServiceService,
    private readonly configService: ConfigService,
  ) {}

  @MessagePattern(AuthPattern.commands.REGISTER)
  register(@Payload() createUserDto: CreateUserDto) {
    return this.authServiceService.register(createUserDto);
  }

  @MessagePattern(AuthPattern.commands.LOGIN)
  login(@Payload() loginUserDto: LoginUserDto) {
    return this.authServiceService.login(loginUserDto);
  }

  @EventPattern(AuthPattern.commands.FORGOT_PASSWORD)
  forgotPassword(@Payload() forgotPasswordDto: ForgotPasswordDto) {
    return this.authServiceService.forgotPassword(forgotPasswordDto);
  }

  @MessagePattern(AuthPattern.commands.RESET_PASSWORD)
  resetPassword(@Payload() resetPasswordRequestDto: ResetPasswordRequestDto) {
    return this.authServiceService.resetPassword(resetPasswordRequestDto);
  }
}
