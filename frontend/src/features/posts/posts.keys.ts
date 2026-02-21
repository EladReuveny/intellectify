import type { PostsQueryDto } from "../../types/posts-query.types";

export const postsKeys = {
  all: ["posts"],
  allQueryPagination: (postQueryDto: PostsQueryDto) => [
    ...postsKeys.all,
    postQueryDto,
  ],
  details: (postId: number) => [...postsKeys.all, postId],
  comments: (postId: number) => [...postsKeys.all, postId, "comments"],
  replies: (postId: number, commentId: number) => [
    ...postsKeys.comments(postId),
    commentId,
  ],
} as const;
