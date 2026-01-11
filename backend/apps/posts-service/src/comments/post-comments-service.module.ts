import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from '../entities/like.entity';
import { PostsServiceModule } from '../posts/posts-service.module';
import { PostComment } from './entities/post-comment.entity';
import { PostCommentsServiceController } from './post-comments-service.controller';
import { PostCommentsServiceService } from './post-comments-service.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostComment, Like]),
    forwardRef(() => PostsServiceModule),
  ],
  controllers: [PostCommentsServiceController],
  providers: [PostCommentsServiceService],
  exports: [],
})
export class PostCommentsServiceModule {}
