import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { comparePwd } from "./lib/cryptoUtils"
import { signInSchema } from "./lib/zod"
import dbConnect from "./lib/mongoUtils"
import User from "./models/User"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials);
          await dbConnect();
          const user: any = await User.findOne({ email }).lean();
          if (!user || Array.isArray(user)) {
            return null;
          }
          const passwordsMatch = await comparePwd(password, user.password);
          if (!passwordsMatch) {
            return null;
          }
          return {
            id: user._id.toString(),
            _id: user._id.toString(),
            email: user.email,
            role: user.role || "viewer",
            image_url: user.image_url || "",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ]
});
