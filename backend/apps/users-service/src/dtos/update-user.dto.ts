import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsStrongPassword, IsUrl } from 'class-validator';
import { CreateUserDto } from '../../../auth-service/src/dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  @IsStrongPassword(
    {
      minLength: 5,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    },
    {
      message:
        'Current password must contain at least one lowercase letter, one uppercase letter, one number, and be at least 5 characters long',
    },
  )
  currentPassword?: string;

  @IsOptional()
  @IsStrongPassword(
    {
      minLength: 5,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    },
    {
      message:
        'New password must contain at least one lowercase letter, one uppercase letter, one number, and be at least 5 characters long',
    },
  )
  newPassword?: string;

  @IsString()
  @IsOptional()
  @IsStrongPassword(
    {
      minLength: 5,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    },
    {
      message:
        'Confirm new password must contain at least one lowercase letter, one uppercase letter, one number, and be at least 5 characters long',
    },
  )
  confirmNewPassword?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  avatarUrl?: string;
}
