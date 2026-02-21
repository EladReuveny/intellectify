import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser, registerUser } from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth.hook";
import type { AuthResponse } from "../../types/auth-response.types";
import type { CreateUser, LoginUser } from "../../types/user.types";
import { handleError } from "../../utils/utils";
import { usersKeys } from "../users/users.keys";

export const useRegisterUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: CreateUser) =>
      registerUser({ email, password }),
    onSuccess: (data: AuthResponse) => {
      const { login } = useAuth();

      const navigate = useNavigate();

      login(data);
      toast.success("Sign up successfully");
      navigate("/profile");

      queryClient.invalidateQueries({
        queryKey: usersKeys.all,
      });
    },
    onError: (err) => handleError(err),
  });
};

export const useLoginUser = () => {
  const queryClient = useQueryClient();

  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: ({ email, password }: LoginUser) =>
      loginUser({ email, password }),
    onSuccess: (data: AuthResponse) => {
      login(data);
      toast.success("Sign in successfully");

      if (location.state?.from === "/register") {
        navigate("/");
      } else {
        navigate(-1);
      }

      queryClient.invalidateQueries({
        queryKey: usersKeys.details(data.data?.user.id!),
      });
    },
    onError: (err) => handleError(err),
  });
};
