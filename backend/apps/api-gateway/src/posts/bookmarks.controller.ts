import { GetUser } from '@app/common/decorators/get-user.decorator';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateBookmarkDto } from 'apps/posts-service/src/bookmarks/dtos/create-bookmark.dto';
import { BookmarksService } from './bookmarks.service';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  createBookmark(
    @GetUser('sub') userId: number,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarksService.createBookmark(userId, createBookmarkDto);
  }

  @Get(':bookmarkId')
  findBookmark(@Param('bookmarkId') bookmarkId: number) {
    return this.bookmarksService.findBookmark(bookmarkId);
  }

  @Delete(':bookmarkId')
  removeBookmark(@Param('bookmarkId') bookmarkId: number) {
    return this.bookmarksService.removeBookmark(bookmarkId);
  }

  @Post(':bookmarkId/posts/:postId')
  addPostToBookmark(
    @Param('bookmarkId') bookmarkId: number,
    @Param('postId') postId: number,
  ) {
    return this.bookmarksService.addPostToBookmark(bookmarkId, postId);
  }

  @Delete(':bookmarkId/posts/:postId')
  removePostFromBookmark(
    @Param('bookmarkId') bookmarkId: number,
    @Param('postId') postId: number,
  ) {
    return this.bookmarksService.removePostFromBookmark(bookmarkId, postId);
  }
}
