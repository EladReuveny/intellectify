import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../entities/like.entity';
import { PostsServiceService } from '../posts/posts-service.service';
import { CreateCommentDto } from './dtos/create-post-comment.dto';
import { PostComment } from './entities/post-comment.entity';

@Injectable()
export class PostCommentsServiceService {
  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentsRepository: Repository<PostComment>,
    @Inject(forwardRef(() => PostsServiceService))
    private readonly postsServiceService: PostsServiceService,
    @InjectRepository(Like) private readonly likesRepository: Repository<Like>,
  ) {}

  async findOne(commentId: number) {
    const comment = await this.postCommentsRepository.findOne({
      where: { id: commentId },
      relations: {
        likes: true,
      },
    });

    if (!comment) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Comment with id ${commentId} not found`,
      });
    }

    return comment;
  }

  async createPostComment(postId: number, createCommentDto: CreateCommentDto) {
    const post = await this.postsServiceService.findOne(postId);

    const newComment = this.postCommentsRepository.create({
      ...createCommentDto,
      post,
    });

    return this.postCommentsRepository.save(newComment);
  }
  async findAllComments(postId: number) {
    return await this.postCommentsRepository.find({
      where: {
        post: {
          id: postId,
        },
      },
      relations: {
        likes: true,
      },
    });
  }

  async toggleLikeComment(userId: number, postId: number, commentId: number) {
    const isLikeExists = await this.likesRepository.exists({
      where: {
        userId,
        comment: {
          id: commentId,
        },
      },
    });

    if (isLikeExists) {
      await this.likesRepository.delete({
        userId,
        comment: {
          id: commentId,
        },
      });
    } else {
      const newLike = this.likesRepository.create({
        userId,
        comment: {
          id: commentId,
        },
        post: {
          id: postId,
        },
      });
      await this.likesRepository.save(newLike);
    }

    const updatedComment = await this.findOne(commentId);

    return updatedComment;
  }
}
