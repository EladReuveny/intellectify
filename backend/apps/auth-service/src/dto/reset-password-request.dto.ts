import { IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordRequestDto {
  @IsString()
  token: string;

  @IsString()
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
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and be at least 5 characters long',
    },
  )
  newPassword: string;

  @IsString()
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
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and be at least 5 characters long',
    },
  )
  confirmNewPassword: string;
}
