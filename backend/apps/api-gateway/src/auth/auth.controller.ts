import { Public } from '@app/common/decorators/public.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto } from 'apps/auth-service/src/dto/forgot-password.dto';
import { ResetPasswordRequestDto } from 'apps/auth-service/src/dto/reset-password-request.dto';
import { CreateUserDto } from '../../../auth-service/src/dto/create-user.dto';
import { LoginUserDto } from '../../../auth-service/src/dto/login-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Public()
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Create a new user account with email and password',
  })
  @ApiBody({ type: CreateUserDto, description: 'User registration data' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or email already exists',
  })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user with email and password',
  })
  @ApiBody({ type: LoginUserDto, description: 'User login credentials' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Forgot password',
    description: 'Send reset password instructions to user email',
  })
  @ApiBody({ type: ForgotPasswordDto, description: 'Forgot password data' })
  @ApiResponse({ status: 200, description: 'Reset password instructions sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password',
    description: 'Reset user password',
  })
  @ApiBody({ type: ForgotPasswordDto, description: 'Reset password data' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 404, description: 'User not found' })
  resetPassword(@Body() resetPasswordRequestDto: ResetPasswordRequestDto) {
    return this.authService.resetPassword(resetPasswordRequestDto);
  }
}
