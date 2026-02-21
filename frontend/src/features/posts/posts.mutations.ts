import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createPost,
  createPostComment,
  removePost,
  toggleLikeComment,
  toggleLikePost,
} from "../../api/posts.api";
import type {
  CreatePostCommentDto,
  PostComment,
} from "../../types/post-comment";
import type { CreatePostDto, Post } from "../../types/post.types";
import { handleError } from "../../utils/utils";
import { usersKeys } from "../users/users.keys";
import { postsKeys } from "./posts.keys";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createPostDto: CreatePostDto) => createPost(createPostDto),
    onSuccess: (data: Post) => {
      queryClient.setQueryData(postsKeys.all, (prev: Post[] = []) => [
        data,
        ...prev,
      ]);
      queryClient.invalidateQueries({ queryKey: postsKeys.all });
      queryClient.invalidateQueries({
        queryKey: usersKeys.posts(data.authorId),
      });
    },
    onError: (err) => handleError(err),
  });
};

export const useRemovePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => removePost(postId),
    onSuccess: (data: void, postId: number) => {
      queryClient.setQueryData(postsKeys.all, (prev: Post[] = []) =>
        prev.filter((p) => p.id !== postId),
      );
      toast.success("Post removed successfully");
      queryClient.invalidateQueries({
        queryKey: postsKeys.all,
      });
    },
    onError: (err) => handleError(err),
  });
};

export const useToggleLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => toggleLikePost(postId),
    onSuccess: (updatedPost: Post, postId: number) => {
      queryClient.setQueryData(postsKeys.details(postId), updatedPost);
      queryClient.invalidateQueries({
        queryKey: postsKeys.details(postId),
        exact: true
      });
    },
    onError: (err) => handleError(err),
  });
};

export const useCreatePostComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      createPostCommentDto,
    }: {
      postId: number;
      createPostCommentDto: CreatePostCommentDto;
    }) => createPostComment(postId, createPostCommentDto),
    onSuccess: (
      data: PostComment,
      {
        postId,
        createPostCommentDto,
      }: { postId: number; createPostCommentDto: CreatePostCommentDto },
    ) => {
      queryClient.invalidateQueries({
        queryKey: postsKeys.comments(postId),
      });
    },
    onError: (err) => handleError(err),
  });
};

export const useToggleLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      commentId,
    }: {
      postId: number;
      commentId: number;
    }) => toggleLikeComment(postId, commentId),
    onSuccess: (
      data: PostComment,
      { postId, commentId }: { postId: number; commentId: number },
    ) => {
      queryClient.invalidateQueries({
        queryKey: postsKeys.comments(postId),
      });
    },
    onError: (err) => handleError(err),
  });
};
