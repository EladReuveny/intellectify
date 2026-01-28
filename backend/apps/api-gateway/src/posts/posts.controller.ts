import { GetUser } from '@app/common/decorators/get-user.decorator';
import { Public } from '@app/common/decorators/public.decorator';
import { PostsQueryDto } from '@app/common/dtos/query/posts-query.dto';
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
  Query,
} from '@nestjs/common';
import { CreateCommentDto } from 'apps/posts-service/src/comments/dtos/create-post-comment.dto';
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
  findAll(@Query() query: PostsQueryDto) {
    return this.postsService.findAll(query);
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

  @Post(':postId/comments')
  createPostComment(
    @GetUser('sub') userId: number,
    @Param('postId') postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postsService.createPostComment(
      userId,
      postId,
      createCommentDto,
    );
  }

  @Get(':postId/comments')
  @Public()
  findAllComments(@Param('postId') postId: number) {
    return this.postsService.findAllComments(postId);
  }

  @Post(':postId/comments/:commentId/likes')
  toggleLikeComment(
    @GetUser('sub') userId: number,
    @Param('postId') postId: number,
    @Param('commentId') commentId: number,
  ) {
    return this.postsService.toggleLikeComment(userId, postId, commentId);
  }
}
