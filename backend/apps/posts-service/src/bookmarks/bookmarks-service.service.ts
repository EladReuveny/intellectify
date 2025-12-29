import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsServiceService } from '../posts-service.service';
import { CreateBookmarkDto } from './dtos/create-bookmark.dto';
import { Bookmark } from './entities/bookmark.entity';

@Injectable()
export class BookmarksServiceService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarksRepository: Repository<Bookmark>,
    @Inject(forwardRef(() => PostsServiceService))
    private readonly postsServiceService: PostsServiceService,
  ) {}

  async createBookmark(userId: number, createBookmarkDto: CreateBookmarkDto) {
    const newBookmark = this.bookmarksRepository.create({
      title: createBookmarkDto.title,
      userId,
    });

    return await this.bookmarksRepository.save(newBookmark);
  }

  async findBookmark(bookmarkId: number) {
    const bookmark = await this.bookmarksRepository.findOne({
      where: { id: bookmarkId },
      relations: {
        posts: {
          likes: true,
        },
      },
    });

    if (!bookmark) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Bookmark with id ${bookmarkId} not found`,
      });
    }

    return bookmark;
  }

  async removeBookmark(bookmarkId: number) {
    const bookmark = await this.findBookmark(bookmarkId);

    return await this.bookmarksRepository.remove(bookmark);
  }

  async addPostToBookmark(bookmarkId: number, postId: number) {
    const bookmark = await this.bookmarksRepository.findOne({
      where: {
        id: bookmarkId,
      },
      relations: {
        posts: true,
      },
    });

    if (!bookmark) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Bookmark with id ${bookmarkId} not found`,
      });
    }

    const post = await this.postsServiceService.findOne(postId);

    const isPostsExistInBookmark = bookmark.posts.some((p) => p.id === post.id);
    if (isPostsExistInBookmark) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message: `Post with id ${postId} already exists in bookmark with id ${bookmarkId}`,
      });
    }

    bookmark.posts.push(post);

    return await this.bookmarksRepository.save(bookmark);
  }

  async removePostFromBookmark(bookmarkId: number, postId: number) {
    const bookmark = await this.bookmarksRepository.findOne({
      where: {
        id: bookmarkId,
      },
      relations: {
        posts: {
          likes: true,
        },
      },
    });

    if (!bookmark) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Bookmark with id ${bookmarkId} not found`,
      });
    }

    bookmark.posts = bookmark.posts.filter((post) => post.id !== postId);

    return await this.bookmarksRepository.save(bookmark);
  }

  async findUserBookmarks(userId: number) {
    const bookmarks = await this.bookmarksRepository.find({
      where: {
        userId,
      },
      relations: {
        posts: true,
      },
    });

    return bookmarks;
  }
}
