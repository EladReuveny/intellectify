import type { PostComment } from "./post-comment";
import type { Post } from "./post.types";

export type Like = {
  id: number;
  userId: number;
  post: Post;
  comment: PostComment;
};
