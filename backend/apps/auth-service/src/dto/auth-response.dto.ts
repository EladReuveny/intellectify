import { User } from 'apps/users-service/src/entities/user.entity';

export class AuthResponseDto {
  status: 'SUCCESS' | 'ERROR';
  message: string;
  data?: {
    accessToken: string;
    user: Partial<User>;
  };
}
