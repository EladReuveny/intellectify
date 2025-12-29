import type { Post } from "./post.types";

export type Like = {
  id: number;
  post: Post;
  userId: number;
};
