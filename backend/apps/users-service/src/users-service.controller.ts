import { USERS_PATTERNS } from '@app/common/constants/patterns/users.patterns';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersServiceService } from './users-service.service';

@Controller()
export class UsersServiceController {
  constructor(private readonly usersServiceService: UsersServiceService) {}

  @MessagePattern(USERS_PATTERNS.commands.FIND_ALL)
  async findAll() {
    return await this.usersServiceService.findAll();
  }

  @MessagePattern(USERS_PATTERNS.commands.FIND_ONE)
  async findOne(@Payload() { id }: { id: number }) {
    return await this.usersServiceService.findOne(id);
  }

  @MessagePattern(USERS_PATTERNS.commands.UPDATE)
  async update(
    @Payload()
    { id, updateUserDto }: { id: number; updateUserDto: UpdateUserDto },
  ) {
    return await this.usersServiceService.update(id, updateUserDto);
  }

  @MessagePattern(USERS_PATTERNS.commands.REMOVE)
  async remove(@Payload() { id }: { id: number }) {
    return await this.usersServiceService.remove(id);
  }
}
