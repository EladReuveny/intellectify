import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class PostsQueryDto {
  @IsString()
  @IsOptional()
  q: string = '';

  @IsInt()
  @IsOptional()
  page: number = 1;

  @IsInt()
  @IsOptional()
  limit: number = 25;

  @IsIn(['title', 'createdAt', 'likes', 'comments'])
  @IsOptional()
  sortBy: 'title' | 'createdAt' | 'likes' | 'comments' = 'createdAt';

  @IsIn(['asc', 'desc'])
  @IsOptional()
  order: 'asc' | 'desc' = 'desc';
}
