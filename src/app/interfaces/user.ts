export interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  thumbnailUrl?: string;
}

export interface UserResType {
  id: number;
  user: UserType;
}