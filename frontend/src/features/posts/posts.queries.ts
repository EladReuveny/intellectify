import { useQuery } from "@tanstack/react-query";
import {
  findAllCommentReplies,
  findAllPosts,
  findAllRootComments,
  findPost,
} from "../../api/posts.api";
import type { PostsQueryDto } from "../../types/posts-query.types";
import { postsKeys } from "./posts.keys";

export const useFindPost = (postId: number) =>
  useQuery({
    queryKey: postsKeys.details(Number(postId)),
    queryFn: () => findPost(Number(postId)),
    enabled: !!postId,
  });

export const useFindAllPosts = (postQueryDto: PostsQueryDto) =>
  useQuery({
    queryKey: postsKeys.allQueryPagination(postQueryDto),
    queryFn: () => findAllPosts(postQueryDto),
  });

export const useFetchAllRootComments = (postId: number) =>
  useQuery({
    queryKey: postsKeys.comments(postId),
    queryFn: () => findAllRootComments(postId),
    enabled: !!postId,
  });

export const useFindAllCommentReplies = (
  postId: number,
  commentId: number,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: postsKeys.replies(postId, commentId),
    queryFn: () => findAllCommentReplies(postId, commentId),
    enabled: options?.enabled && !!postId && !!commentId,
  });
