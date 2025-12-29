import type { Post } from "./post.types";

export type Bookmark = {
  id: number;
  title: string;
  updatedAt: Date;
  userId: number;
  posts: Post[];
};

export type CreateBookmarkDto = Pick<Bookmark, "title">;
