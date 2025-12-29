import type { AuthResponse } from "../types/auth-response.types";
import type { CreateUser, LoginUser } from "../types/user.types";
import { api } from "./api.config";

const PREFIX_RESOURCE = "auth";

export const loginUser = async (
  loginUser: LoginUser
): Promise<AuthResponse> => {
  const { data } = await api.post(`/${PREFIX_RESOURCE}/login`, loginUser);
  return data;
};

export const registerUser = async (
  createUser: CreateUser
): Promise<AuthResponse> => {
  const { data } = await api.post(`/${PREFIX_RESOURCE}/register`, createUser);
  return data;
};
