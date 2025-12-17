import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersServiceService } from './users-service.service';

@Controller()
export class UsersServiceController {
  constructor(private readonly usersServiceService: UsersServiceService) {}

  @MessagePattern({ cmd: 'findAll' })
  async findAll() {
    return await this.usersServiceService.findAll();
  }

  @MessagePattern({ cmd: 'findOne' })
  async findOne(@Payload() { id }: { id: number }) {
    return await this.usersServiceService.findOne(id);
  }

  @MessagePattern({ cmd: 'update' })
  async update(
    @Payload()
    { id, updateUserDto }: { id: number; updateUserDto: UpdateUserDto },
  ) {
    return await this.usersServiceService.update(id, updateUserDto);
  }

  @MessagePattern({ cmd: 'remove' })
  async remove(@Payload() { id }: { id: number }) {
    return await this.usersServiceService.remove(id);
  }
}
