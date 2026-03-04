import { useQueries, useQuery } from "@tanstack/react-query";
import {
  findUserBookmarks,
  findUserLikedPosts,
  findUserPosts,
  getAllUsers,
  getUser,
} from "../../api/users.api";
import { usersKeys } from "./users.keys";

export const useGetUser = (userId: number) =>
  useQuery({
    queryKey: usersKeys.details(userId),
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });

export const useFindUserPosts = (userId: number) =>
  useQuery({
    queryKey: usersKeys.posts(userId),
    queryFn: () => findUserPosts(userId),
    enabled: !!userId,
  });

export const useFindUserLikedPosts = (userId: number) =>
  useQuery({
    queryKey: usersKeys.likedPosts(userId),
    queryFn: () => findUserLikedPosts(userId),
    enabled: !!userId,
  });

export const useFindUserBookmarks = (
  userId: number,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: usersKeys.bookmarks(userId),
    queryFn: () => findUserBookmarks(userId),
    enabled: options?.enabled,
  });

export const useGetUserStats = (userId: number) =>
  useQueries({
    queries: [
      {
        queryKey: usersKeys.details(userId),
        queryFn: () => getUser(userId),
        enabled: !!userId,
      },
      {
        queryKey: usersKeys.posts(userId),
        queryFn: () => findUserPosts(userId),
        enabled: !!userId,
      },
      {
        queryKey: usersKeys.likedPosts(userId),
        queryFn: () => findUserLikedPosts(userId),
        enabled: !!userId,
      },
      {
        queryKey: usersKeys.bookmarks(userId),
        queryFn: () => findUserBookmarks(userId),
        enabled: !!userId,
      },
    ],
  });

export const useGetAllUsers = () =>
  useQuery({
    queryKey: usersKeys.all,
    queryFn: getAllUsers,
  });
