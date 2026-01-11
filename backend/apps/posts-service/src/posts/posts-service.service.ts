import { Microservice } from '@app/common/constants/microservices';
import { USERS_PATTERNS } from '@app/common/constants/patterns/users.patterns';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';

import { Like } from '../entities/like.entity';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostsServiceService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    @InjectRepository(Like) private readonly likesRepository: Repository<Like>,
    @Inject(Microservice.USERS)
    private readonly usersClient: ClientProxy,
  ) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const author = await lastValueFrom(
        this.usersClient.send(USERS_PATTERNS.commands.FIND_ONE, {
          id: createPostDto.authorId,
        }),
      );
    } catch (err) {
      throw new RpcException(err);
    }

    const post = this.postsRepository.create(createPostDto);

    return this.postsRepository.save(post);
  }

  async findAll() {
    return await this.postsRepository.find({ relations: { likes: true } });
  }

  async findOne(postId: number) {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: { likes: true },
    });

    if (!post) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Post with id ${postId} not found`,
      });
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);

    if (updatePostDto.title) {
      post.title = updatePostDto.title;
    }

    if (updatePostDto.content) {
      post.content = updatePostDto.content;
    }

    if (updatePostDto.imageUrl) {
      post.imageUrl = updatePostDto.imageUrl;
    }

    return await this.postsRepository.save(post);
  }
  async remove(id: number) {
    const post = await this.findOne(id);

    return await this.postsRepository.remove(post);
  }

  async findUserPosts(userId: number) {
    try {
      const user = await lastValueFrom(
        this.usersClient.send(USERS_PATTERNS.commands.FIND_ONE, {
          id: userId,
        }),
      );
    } catch (err) {
      throw new RpcException(err);
    }

    return await this.postsRepository.find({
      where: { authorId: userId },
      relations: { likes: true },
    });
  }

  async toggleLikePost(userId: number, postId: number) {
    const post = await this.findOne(postId);

    const isLikeExist = post.likes.find((like) => like.userId === userId);

    if (isLikeExist) {
      await this.likesRepository.delete({ id: isLikeExist.id });
      post.likes = post.likes.filter((like) => like.userId !== userId);
    } else {
      const newLike = this.likesRepository.create({
        post: { id: postId },
        userId,
      });
      await this.likesRepository.save(newLike);
      post.likes.push(newLike);
    }

    return await this.postsRepository.save(post);
  }

  async findUserLikedPosts(userId: number) {
    const posts = await this.likesRepository.find({
      where: { userId },
      relations: {
        post: {
          likes: true,
        },
      },
    });

    return posts;
  }
}
