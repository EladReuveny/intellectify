import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  authorId: number;
}
