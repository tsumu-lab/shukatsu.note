import { DefaultSession } from "next-auth";

// session.user.id という書き方を、TypeScript的にも正しいと認識させるための設定
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}