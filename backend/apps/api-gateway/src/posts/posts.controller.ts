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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCommentDto } from 'apps/posts-service/src/comments/dtos/create-post-comment.dto';
import { CreatePostDto } from 'apps/posts-service/src/dtos/create-post.dto';
import { UpdatePostDto } from 'apps/posts-service/src/dtos/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new post',
    description: 'Create a new post with title, content, and optional image',
  })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get all posts',
    description: 'Retrieve paginated list of posts with optional filters',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Posts per page',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    enum: ['title', 'createdAt', 'likes', 'comments'],
    description: 'Sort by field',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    type: String,
    enum: ['asc', 'desc'],
    description: 'Sort order',
  })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  findAll(@Query() query: PostsQueryDto) {
    return this.postsService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Get post by ID',
    description: 'Retrieve detailed information about a specific post',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  findOne(@Param('id') postId: number) {
    return this.postsService.findOne(postId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a post',
    description: 'Update post content (author only)',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not post author' })
  update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a post',
    description: 'Delete a post (author only)',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not post author' })
  remove(@Param('id') id: number) {
    return this.postsService.remove(id);
  }

  @Post(':postId/likes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Toggle like on post',
    description: 'Like or unlike a post',
  })
  @ApiParam({ name: 'postId', type: Number, description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Like toggled successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  toggleLikePost(
    @GetUser('sub') userId: number,
    @Param('postId') postId: number,
  ) {
    return this.postsService.toggleLikePost(userId, postId);
  }

  @Post(':postId/comments')
  @ApiOperation({
    summary: 'Create a comment on post',
    description: 'Add a new comment to a post',
  })
  @ApiParam({ name: 'postId', type: Number, description: 'Post ID' })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({
    summary: 'Get all root comments on post',
    description: 'Retrieve all root comments for a specific post',
  })
  @ApiParam({ name: 'postId', type: Number, description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Root comments retrieved successfully',
  })
  findAllRootComments(@Param('postId') postId: number) {
    return this.postsService.findAllRootComments(postId);
  }

  @Get(':postId/comments/:commentId/replies')
  @Public()
  @ApiOperation({
    summary: 'Get all replies for a comment',
    description: 'Retrieve all replies for a specific comment',
  })
  @ApiParam({ name: 'postId', type: Number, description: 'Post ID' })
  @ApiParam({ name: 'commentId', type: Number, description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'Replies retrieved successfully' })
  findAllCommentReplies(
    @Param('postId') postId: number,
    @Param('commentId') commentId: number,
  ) {
    return this.postsService.findAllCommentReplies(postId, commentId);
  }

  @Post(':postId/comments/:commentId/likes')
  @ApiOperation({
    summary: 'Toggle like on comment',
    description: 'Like or unlike a comment',
  })
  @ApiParam({ name: 'postId', type: Number, description: 'Post ID' })
  @ApiParam({ name: 'commentId', type: Number, description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'Like toggled successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  toggleLikeComment(
    @GetUser('sub') userId: number,
    @Param('postId') postId: number,
    @Param('commentId') commentId: number,
  ) {
    return this.postsService.toggleLikeComment(userId, postId, commentId);
  }
}
