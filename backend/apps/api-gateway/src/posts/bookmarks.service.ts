import { Microservice } from '@app/common/constants/microservices';
import { PostsPattern } from '@app/common/constants/patterns/posts.pattern';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateBookmarkDto } from 'apps/posts-service/src/bookmarks/dtos/create-bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(
    @Inject(Microservice.POSTS) private readonly postsClient: ClientProxy,
  ) {}

  createBookmark(userId: number, createBookmarkDto: CreateBookmarkDto) {
    return this.postsClient.send(PostsPattern.commands.CREATE_BOOKMARK, {
      userId,
      createBookmarkDto,
    });
  }

  findBookmark(bookmarkId: number) {
    return this.postsClient.send(PostsPattern.commands.FIND_BOOKMARK, {
      bookmarkId,
    });
  }

  removeBookmark(bookmarkId: number) {
    return this.postsClient.send(PostsPattern.commands.REMOVE_BOOKMARK, {
      bookmarkId,
    });
  }

  addPostToBookmark(bookmarkId: number, postId: number) {
    return this.postsClient.send(PostsPattern.commands.ADD_POST_TO_BOOKMARK, {
      bookmarkId,
      postId,
    });
  }

  removePostFromBookmark(bookmarkId: number, postId: number) {
    return this.postsClient.send(
      PostsPattern.commands.REMOVE_POST_FROM_BOOKMARK,
      {
        bookmarkId,
        postId,
      },
    );
  }
}
