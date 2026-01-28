import type { Like } from "./like.types";
import type { Post } from "./post.types";

export type PostComment = {
  id: number;
  content: string;
  createdAt: Date;
  userId: number;
  likes: Like[];
  post: Post;
  commentParent?: PostComment;
  replies?: PostComment[];
};

export type CreatePostCommentDto = {
  content: string;
  commentParentId?: number;
};
