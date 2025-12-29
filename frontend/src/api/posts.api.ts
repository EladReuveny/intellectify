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
