export type User = {
  id: number;

  email: string;

  password: string;

  createdAt: Date;

  role: Role;

  avatarUrl?: string;
};

export type Role = "user" | "admin";

export type LoginUser = Pick<User, "email" | "password">;

export type CreateUser = Pick<User, "email" | "password">;
