import type { User } from "./user.types";

export type AuthResponse = {
  status: "SUCCESS" | "ERROR";

  message: string;

  data?: AuthResponseData;
};

export type AuthResponseData = {
  accessToken: string;
  user: Partial<User>;
};
