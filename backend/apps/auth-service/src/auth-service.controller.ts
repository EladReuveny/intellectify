import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from 'apps/auth-service/src/dto/create-user.dto';
import { LoginUserDto } from 'apps/auth-service/src/dto/login-user.dto';
import { AuthServiceService } from './auth-service.service';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @MessagePattern({ cmd: 'register' })
  register(@Payload() createUserDto: CreateUserDto) {
    return this.authServiceService.register(createUserDto);
  }

  @MessagePattern({ cmd: 'login' })
  login(@Payload() loginUserDto: LoginUserDto) {
    return this.authServiceService.login(loginUserDto);
  }
}
