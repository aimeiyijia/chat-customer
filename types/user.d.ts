interface User {
  userId: string;
  username: string;
  password?: string;
  avatar: string;
  role?: string;
  tag?: string;
  platform?: string
  createTime: number;
}

declare module 'js-cookie'
