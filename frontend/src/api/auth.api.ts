import type {
  AuthResponse,
  ForgotPassword,
  ResetPasswordRequest,
} from "../types/auth.types";
import type { CreateUser, LoginUser } from "../types/user.types";
import { api } from "./api.config";

const PREFIX_RESOURCE = "auth";

export const loginUser = async (
  loginUser: LoginUser,
): Promise<AuthResponse> => {
  const { data } = await api.post(`/${PREFIX_RESOURCE}/login`, loginUser);
  return data;
};

export const registerUser = async (
  createUser: CreateUser,
): Promise<AuthResponse> => {
  const { data } = await api.post(`/${PREFIX_RESOURCE}/register`, createUser);
  return data;
};

export const forgotPassword = async (
  forgotPasswordDto: ForgotPassword,
): Promise<void> => {
  const { data } = await api.post(
    `/${PREFIX_RESOURCE}/forgot-password`,
    forgotPasswordDto,
  );
  return data;
};

export const resetPassword = async (
  resetPasswordRequestDto: ResetPasswordRequest,
): Promise<{
  userId: number;
  message: string;
}> => {
  const { data } = await api.post(
    `/${PREFIX_RESOURCE}/reset-password`,
    resetPasswordRequestDto,
  );
  return data;
};
