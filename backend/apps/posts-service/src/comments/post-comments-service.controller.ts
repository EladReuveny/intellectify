import { PostsPattern } from '@app/common/constants/patterns/posts.pattern';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateCommentDto } from './dtos/create-post-comment.dto';
import { PostCommentsServiceService } from './post-comments-service.service';

@Controller()
export class PostCommentsServiceController {
  constructor(
    private readonly postCommentsServiceService: PostCommentsServiceService,
  ) {}

  @MessagePattern(PostsPattern.commands.CREATE_POST_COMMENT)
  createPostComment(
    @Payload()
    {
      userId,
      postId,
      createCommentDto,
    }: {
      userId: number;
      postId: number;
      createCommentDto: CreateCommentDto;
    },
  ) {
    return this.postCommentsServiceService.createPostComment(
      userId,
      postId,
      createCommentDto,
    );
  }

  @MessagePattern(PostsPattern.commands.FIND_ALL_COMMENTS)
  findAllComments(@Payload() { postId }: { postId: number }) {
    return this.postCommentsServiceService.findAllComments(postId);
  }

  @MessagePattern(PostsPattern.commands.TOGGLE_LIKE_COMMENT)
  toggleLikeComment(
    @Payload()
    {
      userId,
      postId,
      commentId,
    }: {
      userId: number;
      postId: number;
      commentId: number;
    },
  ) {
    return this.postCommentsServiceService.toggleLikeComment(
      userId,
      postId,
      commentId,
    );
  }
}
