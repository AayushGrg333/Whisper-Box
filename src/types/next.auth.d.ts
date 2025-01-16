import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
    isAcceptingMessage: boolean;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
    isAcceptingMessage: boolean;
  }
}