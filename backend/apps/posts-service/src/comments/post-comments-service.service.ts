import { Microservice } from '@app/common/constants/microservices';
import { USERS_PATTERNS } from '@app/common/constants/patterns/users.patterns';
import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'apps/users-service/src/entities/user.entity';
import { lastValueFrom } from 'rxjs';
import { IsNull, Repository } from 'typeorm';
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
    @Inject(Microservice.USERS) private readonly usersClient: ClientProxy,
  ) {}

  async findOne(commentId: number) {
    const comment = await this.postCommentsRepository.findOne({
      where: { id: commentId },
      relations: {
        likes: true,
        replies: true,
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

  async createPostComment(
    userId: number,
    postId: number,
    createCommentDto: CreateCommentDto,
  ) {
    const post = await this.postsServiceService.findOne(postId);

    let commentParent: PostComment | undefined = undefined;
    if (createCommentDto.commentParentId) {
      commentParent = await this.findOne(createCommentDto.commentParentId);
    }

    const newComment = this.postCommentsRepository.create({
      ...createCommentDto,
      userId,
      post,
      commentParent,
    });

    return this.postCommentsRepository.save(newComment);
  }
  async findAllRootComments(postId: number) {
    const comments = await this.postCommentsRepository.find({
      where: {
        post: {
          id: postId,
        },
        commentParent: IsNull(),
      },
      relations: {
        likes: true,
      },
      loadRelationIds: {
        relations: ['replies'],
      },
      order: {
        createdAt: 'ASC',
      },
    });

    const userIds = comments.map((c) => c.userId);

    const users: User[] = await lastValueFrom(
      this.usersClient.send(USERS_PATTERNS.commands.FIND_MANY, { userIds }),
    );

    const usersMap = new Map(users.map((u) => [u.id, u]));

    return comments.map((c) => {
      const user = usersMap.get(c.userId);

      if (!user) {
        return c;
      }

      const { id, email, avatarUrl } = user;

      return {
        ...c,
        user: {
          id,
          email,
          avatarUrl,
        },
      };
    });
  }

  async findAllCommentReplies(postId: number, commentId: number) {
    const commentReplies = await this.postCommentsRepository.find({
      where: {
        commentParent: {
          id: commentId,
        },
      },
      relations: {
        likes: true,
        replies: true,
      },
    });

    const userIds = commentReplies.map((c) => c.userId);

    const users: User[] = await lastValueFrom(
      this.usersClient.send(USERS_PATTERNS.commands.FIND_MANY, { userIds }),
    );

    const usersMap = new Map(users.map((u) => [u.id, u]));

    return commentReplies.map((c) => {
      const user = usersMap.get(c.userId);

      if (!user) {
        return c;
      }

      const { id, email, avatarUrl } = user;

      return {
        ...c,
        user: {
          id,
          email,
          avatarUrl,
        },
      };
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
