import { PostsPattern } from '@app/common/constants/patterns/posts.pattern';
import { PostsQueryDto } from '@app/common/dtos/query/posts-query.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { PostsServiceService } from './posts-service.service';

@Controller()
export class PostsServiceController {
  constructor(private readonly postsServiceService: PostsServiceService) {}

  @MessagePattern(PostsPattern.commands.CREATE)
  async create(@Payload() createPostDto: CreatePostDto) {
    return await this.postsServiceService.create(createPostDto);
  }

  @MessagePattern(PostsPattern.commands.FIND_ALL)
  async findAll(query: PostsQueryDto) {
    return await this.postsServiceService.findAll(query);
  }

  @MessagePattern(PostsPattern.commands.FIND_ONE)
  async findOne(@Payload() { postId }: { postId: number }) {
    return await this.postsServiceService.findOne(postId);
  }

  @MessagePattern(PostsPattern.commands.UPDATE)
  async update(
    @Payload()
    { id, updatePostDto }: { id: number; updatePostDto: UpdatePostDto },
  ) {
    return await this.postsServiceService.update(id, updatePostDto);
  }

  @MessagePattern(PostsPattern.commands.REMOVE)
  async remove(@Payload() { id }: { id: number }) {
    return await this.postsServiceService.remove(id);
  }

  @MessagePattern(PostsPattern.commands.FIND_USER_POSTS)
  async findUserPosts(@Payload() { userId }: { userId: number }) {
    return await this.postsServiceService.findUserPosts(userId);
  }

  @MessagePattern(PostsPattern.commands.TOGGLE_LIKE_POST)
  async toggleLikePost(
    @Payload() { userId, postId }: { userId: number; postId: number },
  ) {
    return await this.postsServiceService.toggleLikePost(userId, postId);
  }

  @MessagePattern(PostsPattern.commands.FIND_USER_LIKED_POSTS)
  async findUserLikedPosts(@Payload() { userId }: { userId: number }) {
    return await this.postsServiceService.findUserLikedPosts(userId);
  }
}
