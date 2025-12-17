import { Microservice } from '@app/common/constants/constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from '../../../auth-service/src/dto/create-user.dto';
import { LoginUserDto } from '../../../auth-service/src/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(Microservice.AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}

  register(createUserDto: CreateUserDto) {
    return this.authClient.send({ cmd: 'register' }, createUserDto);
  }

  login(loginUserDto: LoginUserDto) {
    return this.authClient.send({ cmd: 'login' }, loginUserDto);
  }
}
