import { api } from "../config";
import type { AuthResponse } from "../types/authResponse";
import type { CreateUser, LoginUser } from "../types/user";

const PREFIX_RESOURCE = "auth";

export const loginUser = async (loginUser: LoginUser): Promise<AuthResponse> => {
  const res = await api.post(`/${PREFIX_RESOURCE}/login`, loginUser);
  return res.data;
};

export const registerUser = async (
  createUser: CreateUser
): Promise<AuthResponse> => {
  const res = await api.post(`/${PREFIX_RESOURCE}/register`, createUser);
  return res.data;
};
