import { Public } from '@app/common/decorators/public.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../../../auth-service/src/dto/create-user.dto';
import { LoginUserDto } from '../../../auth-service/src/dto/login-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
