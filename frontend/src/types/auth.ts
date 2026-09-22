export interface AuthUser {
  pk: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

export interface RefreshResponse {
  access: string;
  refresh?: string;
}