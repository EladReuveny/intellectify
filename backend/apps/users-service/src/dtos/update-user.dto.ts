import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../../auth-service/src/dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
