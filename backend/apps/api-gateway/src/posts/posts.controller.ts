import { GetUser } from '@app/common/decorators/get-user.decorator';
import { Public } from '@app/common/decorators/public.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePostDto } from 'apps/posts-service/src/dtos/create-post.dto';
import { UpdatePostDto } from 'apps/posts-service/src/dtos/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') postId: number) {
    return this.postsService.findOne(postId);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.postsService.remove(id);
  }

  @Post(':postId/likes')
  @HttpCode(HttpStatus.OK)
  toggleLikePost(
    @GetUser('sub') userId: number,
    @Param('postId') postId: number,
  ) {
    return this.postsService.toggleLikePost(userId, postId);
  }
}
