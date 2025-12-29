import { PostsPattern } from '@app/common/constants/patterns/posts.pattern';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { BookmarksServiceService } from './bookmarks-service.service';
import { CreateBookmarkDto } from './dtos/create-bookmark.dto';

@Controller()
export class BookmarksServiceController {
  constructor(
    private readonly bookmarksServiceService: BookmarksServiceService,
  ) {}

  @MessagePattern(PostsPattern.commands.CREATE_BOOKMARK)
  async createBookmark(
    @Payload()
    {
      userId,
      createBookmarkDto,
    }: {
      userId: number;
      createBookmarkDto: CreateBookmarkDto;
    },
  ) {
    return await this.bookmarksServiceService.createBookmark(
      userId,
      createBookmarkDto,
    );
  }

  @MessagePattern(PostsPattern.commands.FIND_BOOKMARK)
  async findBookmark(@Payload() { bookmarkId }: { bookmarkId: number }) {
    return await this.bookmarksServiceService.findBookmark(bookmarkId);
  }

  @MessagePattern(PostsPattern.commands.REMOVE_BOOKMARK)
  async removeBookmark(@Payload() { bookmarkId }: { bookmarkId: number }) {
    return await this.bookmarksServiceService.removeBookmark(bookmarkId);
  }

  @MessagePattern(PostsPattern.commands.ADD_POST_TO_BOOKMARK)
  async addPostToBookmark(
    @Payload() { bookmarkId, postId }: { bookmarkId: number; postId: number },
  ) {
    return await this.bookmarksServiceService.addPostToBookmark(
      bookmarkId,
      postId,
    );
  }

  @MessagePattern(PostsPattern.commands.REMOVE_POST_FROM_BOOKMARK)
  async removePostFromBookmark(
    @Payload() { bookmarkId, postId }: { bookmarkId: number; postId: number },
  ) {
    return await this.bookmarksServiceService.removePostFromBookmark(
      bookmarkId,
      postId,
    );
  }

  @MessagePattern(PostsPattern.commands.FIND_USER_BOOKMARKED_POSTS)
  async findUserBookmarks(@Payload() { userId }: { userId: number }) {
    return await this.bookmarksServiceService.findUserBookmarks(userId);
  }
}
