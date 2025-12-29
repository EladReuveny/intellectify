import { Microservice } from '@app/common/constants/microservices';
import { PostsPattern } from '@app/common/constants/patterns/posts.pattern';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePostDto } from 'apps/posts-service/src/dtos/create-post.dto';
import { UpdatePostDto } from 'apps/posts-service/src/dtos/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @Inject(Microservice.POSTS)
    private readonly postsClient: ClientProxy,
  ) {}

  create(createPostDto: CreatePostDto) {
    return this.postsClient.send(PostsPattern.commands.CREATE, createPostDto);
  }

  findAll() {
    return this.postsClient.send(PostsPattern.commands.FIND_ALL, {});
  }

  findOne(postId: number) {
    return this.postsClient.send(PostsPattern.commands.FIND_ONE, {
      postId,
    });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.postsClient.send(PostsPattern.commands.UPDATE, {
      id,
      updatePostDto,
    });
  }

  remove(id: number) {
    return this.postsClient.send(PostsPattern.commands.REMOVE, { id });
  }

  toggleLikePost(userId: number, postId: number) {
    return this.postsClient.send(PostsPattern.commands.TOGGLE_LIKE_POST, {
      userId,
      postId,
    });
  }
}
