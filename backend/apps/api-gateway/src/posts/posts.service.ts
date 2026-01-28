import { Microservice } from '@app/common/constants/microservices';
import { PostsPattern } from '@app/common/constants/patterns/posts.pattern';
import { PostsQueryDto } from '@app/common/dtos/query/posts-query.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCommentDto } from 'apps/posts-service/src/comments/dtos/create-post-comment.dto';
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

  findAll(query: PostsQueryDto) {
    return this.postsClient.send(PostsPattern.commands.FIND_ALL, query);
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

  createPostComment(
    userId: number,
    postId: number,
    createCommentDto: CreateCommentDto,
  ) {
    return this.postsClient.send(PostsPattern.commands.CREATE_POST_COMMENT, {
      userId,
      postId,
      createCommentDto,
    });
  }

  findAllComments(postId: number) {
    return this.postsClient.send(PostsPattern.commands.FIND_ALL_COMMENTS, {
      postId,
    });
  }

  toggleLikeComment(userId: number, postId: number, commentId: number) {
    return this.postsClient.send(PostsPattern.commands.TOGGLE_LIKE_COMMENT, {
      userId,
      postId,
      commentId,
    });
  }
}
