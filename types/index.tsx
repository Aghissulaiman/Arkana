// types/index.ts
export type UserRole = "admin" | "user" | "mitra" | "agent" | "factory";

export const ROLE_HOMES: Record<UserRole, string> = {
  admin: "/admin/home",
  user: "/user/home",
  mitra: "/mitra/home",
  agent: "/agent/home",
  factory: "/factory/home",
};

export const ROLE_PATHS: Record<UserRole, string> = {
  admin: "/admin",
  user: "/user",
  mitra: "/mitra",
  agent: "/agent",
  factory: "/factory",
};

export interface UserMetadata {
  role: UserRole;
  full_name?: string;
  phone?: string;
  address?: string;
}