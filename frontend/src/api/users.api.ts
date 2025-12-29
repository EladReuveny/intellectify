import type { Bookmark } from "../types/bookmark.types";
import type { Like } from "../types/like.types";
import type { Post } from "../types/post.types";
import type { UpdateUser, User } from "../types/user.types";
import { api } from "./api.config";

const PREFIX_RESOURCE = "users";

export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await api.get(`/${PREFIX_RESOURCE}`);
  return data;
};

export const getUser = async (userId: number): Promise<User> => {
  const { data } = await api.get(`/${PREFIX_RESOURCE}/${userId}`);
  return data;
};

export const updateUser = async (
  userId: number,
  updateUser: UpdateUser
): Promise<User[]> => {
  const { data } = await api.patch(`/${PREFIX_RESOURCE}/${userId}`, updateUser);
  return data;
};

export const removeUser = async (userId: number): Promise<void> => {
  const { data } = await api.delete(`/${PREFIX_RESOURCE}/${userId}`);
  return data;
};

export const findUserPosts = async (userId: number): Promise<Post[]> => {
  const { data } = await api.get(`/${PREFIX_RESOURCE}/${userId}/posts`);
  return data;
};

export const findUserLikedPosts = async (userId: number): Promise<Like[]> => {
  const { data } = await api.get(`/${PREFIX_RESOURCE}/${userId}/liked-posts`);
  return data;
};

export const findUserBookmarks = async (
  userId: number
): Promise<Bookmark[]> => {
  const { data } = await api.get(`/${PREFIX_RESOURCE}/${userId}/bookmarks`);
  return data;
};
