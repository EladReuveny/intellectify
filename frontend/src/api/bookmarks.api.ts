import type { Bookmark, CreateBookmarkDto } from "../types/bookmark.types";
import { api } from "./api.config";

const PREFIX_RESOURCE = "bookmarks";

export const createBookmark = async (
  createBookmarkDto: CreateBookmarkDto
): Promise<Bookmark> => {
  const { data } = await api.post(`/${PREFIX_RESOURCE}`, createBookmarkDto);
  return data;
};

export const findBookmark = async (bookmarkId: number): Promise<Bookmark> => {
  const { data } = await api.get(`/${PREFIX_RESOURCE}/${bookmarkId}`);
  return data;
};

export const removeBookmark = async (bookmarkId: number): Promise<void> => {
  await api.delete(`/${PREFIX_RESOURCE}/${bookmarkId}`);
};

export const addPostToBookmark = async (
  bookmarkId: number,
  postId: number
): Promise<Bookmark> => {
  const { data } = await api.post(
    `/${PREFIX_RESOURCE}/${bookmarkId}/posts/${postId}`
  );
  return data;
};

export const removePostFromBookmark = async (
  bookmarkId: number,
  postId: number
): Promise<Bookmark> => {
  const { data } = await api.delete(
    `/${PREFIX_RESOURCE}/${bookmarkId}/posts/${postId}`
  );
  return data;
};
