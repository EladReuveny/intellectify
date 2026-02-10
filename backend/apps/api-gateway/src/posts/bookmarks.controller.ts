import { GetUser } from '@app/common/decorators/get-user.decorator';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateBookmarkDto } from 'apps/posts-service/src/bookmarks/dtos/create-bookmark.dto';
import { BookmarksService } from './bookmarks.service';

@Controller('bookmarks')
@ApiTags('Bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bookmark', description: 'Create a new bookmark collection' })
  @ApiBody({ type: CreateBookmarkDto })
  @ApiResponse({ status: 201, description: 'Bookmark created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createBookmark(
    @GetUser('sub') userId: number,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarksService.createBookmark(userId, createBookmarkDto);
  }

  @Get(':bookmarkId')
  @ApiOperation({ summary: 'Get bookmark by ID', description: 'Retrieve a specific bookmark with all its posts' })
  @ApiParam({ name: 'bookmarkId', type: Number, description: 'Bookmark ID' })
  @ApiResponse({ status: 200, description: 'Bookmark retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Bookmark not found' })
  findBookmark(@Param('bookmarkId') bookmarkId: number) {
    return this.bookmarksService.findBookmark(bookmarkId);
  }

  @Delete(':bookmarkId')
  @ApiOperation({ summary: 'Delete a bookmark', description: 'Remove a bookmark collection' })
  @ApiParam({ name: 'bookmarkId', type: Number, description: 'Bookmark ID' })
  @ApiResponse({ status: 200, description: 'Bookmark deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  removeBookmark(@Param('bookmarkId') bookmarkId: number) {
    return this.bookmarksService.removeBookmark(bookmarkId);
  }

  @Post(':bookmarkId/posts/:postId')
  @ApiOperation({ summary: 'Add post to bookmark', description: 'Add a post to a bookmark collection' })
  @ApiParam({ name: 'bookmarkId', type: Number, description: 'Bookmark ID' })
  @ApiParam({ name: 'postId', type: Number, description: 'Post ID' })
  @ApiResponse({ status: 201, description: 'Post added to bookmark successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  addPostToBookmark(
    @Param('bookmarkId') bookmarkId: number,
    @Param('postId') postId: number,
  ) {
    return this.bookmarksService.addPostToBookmark(bookmarkId, postId);
  }

  @Delete(':bookmarkId/posts/:postId')
  @ApiOperation({ summary: 'Remove post from bookmark', description: 'Remove a post from a bookmark collection' })
  @ApiParam({ name: 'bookmarkId', type: Number, description: 'Bookmark ID' })
  @ApiParam({ name: 'postId', type: Number, description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post removed from bookmark successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  removePostFromBookmark(
    @Param('bookmarkId') bookmarkId: number,
    @Param('postId') postId: number,
  ) {
    return this.bookmarksService.removePostFromBookmark(bookmarkId, postId);
  }
}
