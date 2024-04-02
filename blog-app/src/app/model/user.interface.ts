export interface User {
  id?: number;
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  profileImage?: string;
  role?: string
}
