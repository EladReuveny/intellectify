import { Microservice } from '@app/common/constants/microservices';
import { AuthPattern } from '@app/common/constants/patterns/auth.pattern';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from '../../../auth-service/src/dto/create-user.dto';
import { LoginUserDto } from '../../../auth-service/src/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(Microservice.AUTH) private readonly authClient: ClientProxy,
  ) {}

  register(createUserDto: CreateUserDto) {
    return this.authClient.send(AuthPattern.commands.REGISTER, createUserDto);
  }

  login(loginUserDto: LoginUserDto) {
    return this.authClient.send(AuthPattern.commands.LOGIN, loginUserDto);
  }
}
