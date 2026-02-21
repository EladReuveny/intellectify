import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  addPostToBookmark,
  createBookmark,
  removeBookmark,
  removePostFromBookmark,
} from "../../api/bookmarks.api";
import type { Bookmark, CreateBookmarkDto } from "../../types/bookmark.types";
import { handleError } from "../../utils/utils";
import { usersKeys } from "../users/users.keys";
import { bookmarksKeys } from "./bookmarks.keys";

export const useCreateBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createBookmarkDto: CreateBookmarkDto) =>
      createBookmark(createBookmarkDto),
    onSuccess: (data: Bookmark) => {
      queryClient.setQueryData(
        usersKeys.bookmarks(data.userId),
        (prev: Bookmark[] = []) => [...prev, data],
      );
      toast.success("Bookmark created successfully");
      queryClient.invalidateQueries({
        queryKey: usersKeys.bookmarks(data.userId),
      });
    },
    onError: (err) => handleError(err),
  });
};

export const useAddPostToBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookmarkId,
      postId,
    }: {
      bookmarkId: number;
      postId: number;
    }) => addPostToBookmark(bookmarkId, postId),
    onSuccess: (
      data: Bookmark,
      {
        bookmarkId,
      }: {
        bookmarkId: number;
        postId: number;
      },
    ) => {
      queryClient.setQueryData(bookmarksKeys.details(bookmarkId), data);
      toast.success("Post saved to bookmark successfully");
      queryClient.invalidateQueries({
        queryKey: bookmarksKeys.details(bookmarkId),
      });
      queryClient.invalidateQueries({
        queryKey: usersKeys.bookmarks(data.userId),
      });
    },
    onError: (err) => handleError(err),
  });
};

export const useRemoveBookmark = () =>
  useMutation({
    mutationFn: (bookmarkId: number) => removeBookmark(bookmarkId),
    onSuccess: () => {
      toast.success("Bookmark deleted successfully");
    },
    onError: (err) => handleError(err),
  });

export const useRemovePostFromBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookmarkId,
      postId,
    }: {
      bookmarkId: number;
      postId: number;
    }) => removePostFromBookmark(bookmarkId, postId),
    onSuccess: (
      data: Bookmark,
      { bookmarkId, postId }: { bookmarkId: number; postId: number },
    ) => {
      queryClient.setQueryData(bookmarksKeys.details(bookmarkId), data);
      queryClient.invalidateQueries({
        queryKey: bookmarksKeys.details(bookmarkId),
      });
      queryClient.invalidateQueries({
        queryKey: usersKeys.bookmarks(data.userId),
      });
    },
    onError: (err) => handleError(err),
  });
};
