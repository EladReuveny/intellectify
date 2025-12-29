import type { Like } from "./like.types";

export type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  imageUrl?: string;
  authorId: number;
  likes: Like[];
};

export type CreatePostDto = {
  title: string;
  content: string;
  imageUrl?: string;
  authorId: number;
};

export type UpdatePostDto = Partial<CreatePostDto>;
