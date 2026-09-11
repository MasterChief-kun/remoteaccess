import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    id?: string;
    _id?: string;
    image_url?: string;
    role?: string;
  }

  interface Session {
    user: {
      id?: string;
      _id?: string;
      image_url?: string;
      role?: string;
    } & DefaultSession["user"]
  }
}
