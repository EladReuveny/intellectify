import type { CreatePostCommentDto, PostComment } from "../types/post-comment";
import type { CreatePostDto, Post, UpdatePostDto } from "../types/post.types";
import { api } from "./api.config";

const PREFIX_RESOURCE = "posts";

export const createPost = async (
  createPostDto: CreatePostDto
): Promise<Post> => {
  const { data } = await api.post(`/${PREFIX_RESOURCE}`, createPostDto);
  return data;
};

export const findAllPosts = async (): Promise<Post[]> => {
  const { data } = await api.get(`/${PREFIX_RESOURCE}`);
  return data;
};

export const findPost = async (postId: number): Promise<Post> => {
  const { data } = await api.get(`/${PREFIX_RESOURCE}/${postId}`);
  return data;
};

export const updatePost = async (
  postId: number,
  updatePostDto: UpdatePostDto
): Promise<Post> => {
  const { data } = await api.patch(
    `/${PREFIX_RESOURCE}/${postId}`,
    updatePostDto
  );
  return data;
};

export const removePost = async (postId: number): Promise<void> => {
  const { data } = await api.delete(`/${PREFIX_RESOURCE}/${postId}`);
  return data;
};

export const toggleLikePost = async (postId: number): Promise<Post> => {
  const { data } = await api.post(`/${PREFIX_RESOURCE}/${postId}/likes`);
  return data;
};

export const createPostComment = async (
  postId: number,
  createPostCommentDto: CreatePostCommentDto
): Promise<PostComment> => {
  const { data } = await api.post(
    `/${PREFIX_RESOURCE}/${postId}/comments`,
    createPostCommentDto
  );
  return data;
};

export const findAllPostComments = async (
  postId: number
): Promise<PostComment[]> => {
  const { data } = await api.get(`/${PREFIX_RESOURCE}/${postId}/comments`);
  return data;
};

export const toggleLikeComment = async (
  postId: number,
  commentId: number
): Promise<PostComment> => {
  const { data } = await api.post(
    `/${PREFIX_RESOURCE}/${postId}/comments/${commentId}/likes`
  );
  return data;
};
