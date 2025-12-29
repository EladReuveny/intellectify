import { IsString } from 'class-validator';

export class CreateBookmarkDto {
  @IsString()
  title: string;
}
