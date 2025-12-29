import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsServiceModule } from '../posts-service.module';
import { BookmarksServiceController } from './bookmarks-service.controller';
import { BookmarksServiceService } from './bookmarks-service.service';
import { Bookmark } from './entities/bookmark.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookmark]),
    forwardRef(() => PostsServiceModule),
  ],
  controllers: [BookmarksServiceController],
  providers: [BookmarksServiceService],
  exports: [BookmarksServiceService],
})
export class BookmarksServiceModule {}
