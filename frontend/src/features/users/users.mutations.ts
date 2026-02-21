import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  followUser,
  removeUser,
  unfollowUser,
  updateUser,
} from "../../api/users.api";
import { useAuth } from "../../hooks/useAuth.hook";
import type { UpdateUser, User } from "../../types/user.types";
import { handleError } from "../../utils/utils";
import { usersKeys } from "./users.keys";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      updateUserDto,
    }: {
      userId: number;
      updateUserDto: UpdateUser;
    }) => updateUser(userId, updateUserDto),
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(usersKeys.details(updatedUser.id), updatedUser);
      toast.success("User updated successfully");
      queryClient.invalidateQueries({
        queryKey: usersKeys.details(updatedUser.id),
      });
    },
    onError: (err) => handleError(err),
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => removeUser(userId),

    onSuccess: (data: void, userId: number) => {
      const { logout } = useAuth();

      const navigate = useNavigate();

      logout();
      navigate("/");
      queryClient.setQueryData(usersKeys.all, (prev: User[] = []) =>
        prev.filter((u) => u.id !== userId),
      );
      toast.success("Your account has been deleted successfully");
      queryClient.invalidateQueries({
        queryKey: usersKeys.all,
      });
    },
    onError: (err) => handleError(err),
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userIdToFollow: number) => followUser(userIdToFollow),
    onSuccess: (updatedFollowerData: User, userIdToFollow: number) => {
      queryClient.setQueryData(
        usersKeys.details(updatedFollowerData.id),
        updatedFollowerData,
      );
      toast.success("Followed successfully");
      queryClient.invalidateQueries({
        queryKey: usersKeys.details(updatedFollowerData.id),
      });
      queryClient.invalidateQueries({
        queryKey: usersKeys.details(userIdToFollow),
      });
    },
    onError: (err) => handleError(err),
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userIdToUnfollow: number) => unfollowUser(userIdToUnfollow),
    onSuccess: (updatedFollowerData: User, userIdToUnfollow: number) => {
      queryClient.setQueryData(
        usersKeys.details(updatedFollowerData.id),
        updatedFollowerData,
      );
      toast.success("Unfollowed successfully");
      queryClient.invalidateQueries({
        queryKey: usersKeys.details(updatedFollowerData.id),
      });
      queryClient.invalidateQueries({
        queryKey: usersKeys.details(userIdToUnfollow),
      });
    },
    onError: (err) => handleError(err),
  });
};
