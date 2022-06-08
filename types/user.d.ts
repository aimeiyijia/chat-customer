interface User {
  userId: string;
  username: string;
  avatar: string;
  role?: string;
  tag?: string;
  createTime: number;
}

declare module 'js-cookie'
