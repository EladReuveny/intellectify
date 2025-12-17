import { Microservice } from '@app/common/constants/constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateUserDto } from 'apps/users-service/src/dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(Microservice.USERS_SERVICE)
    private readonly usersClient: ClientProxy,
  ) {}

  findAll() {
    return this.usersClient.send({ cmd: 'findAll' }, {});
  }

  findOne(id: number) {
    return this.usersClient.send({ cmd: 'findOne' }, { id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersClient.send({ cmd: 'update' }, { id, updateUserDto });
  }

  remove(id: number) {
    return this.usersClient.send({ cmd: 'remove' }, { id });
  }
}
