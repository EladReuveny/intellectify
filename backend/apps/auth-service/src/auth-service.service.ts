import { Injectable } from '@nestjs/common';
import { UsersServiceService } from 'apps/users-service/src/users-service.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthServiceService {
  constructor(private readonly usersService: UsersServiceService) {}

  async register(createUserDto: CreateUserDto) {
    return await this.usersService.validateRegisterCredentials(createUserDto);
  }
  async login(loginUserDto: LoginUserDto) {
    return await this.usersService.validateLoginCredentials(loginUserDto);
  }
}
