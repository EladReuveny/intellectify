import { Microservice } from '@app/common/constants/microservices';
import { MailPattern } from '@app/common/constants/patterns/mail.pattern';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { UsersServiceService } from 'apps/users-service/src/users-service.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';

@Injectable()
export class AuthServiceService {
  constructor(
    private readonly usersService: UsersServiceService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(Microservice.MAIL) private readonly mailClient: ClientProxy,
  ) {}

  async register(createUserDto: CreateUserDto) {
    return await this.usersService.validateRegisterCredentials(createUserDto);
  }
  async login(loginUserDto: LoginUserDto) {
    return await this.usersService.validateLoginCredentials(loginUserDto);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.usersService.findOneByEmail(email);

    const { id: userId } = user;

    const token = await this.usersService.generateResetPasswordToken(userId);

    this.mailClient.emit(MailPattern.events.SEND_RESET_PASSWORD_EMAIL, {
      email,
      token,
    });
  }

  async resetPassword(resetPasswordRequestDto: ResetPasswordRequestDto) {
    const { token, newPassword, confirmNewPassword } = resetPasswordRequestDto;

    const isPasswordsMatch = newPassword === confirmNewPassword;
    if (!isPasswordsMatch) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Both password fields must match exactly',
      });
    }

    const resetTokenSecret = this.configService.get<string>(
      'JWT_RESET_TOKEN_SECRET',
    );

    try {
      const payload: {
        sub: number;
        tokenType: string;
      } = this.jwtService.verify(token, {
        secret: resetTokenSecret,
      });

      const { sub: userId, tokenType } = payload;

      if (tokenType !== 'password-reset') {
        throw new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid or expired token. Please try again',
        });
      }

      const { userEmail } = await this.usersService.handleResetPassword(
        userId,
        newPassword,
      );

      this.mailClient.emit(
        MailPattern.events.SEND_RESET_PASSWORD_CONFIRMATION_EMAIL,
        {
          email: userEmail,
        },
      );

      return {
        userId,
        message:
          'Password reset successfully. An confirmation email has been sent to your email address.',
      };
    } catch (err) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid or expired token. Please try again',
      });
    }
  }
}
