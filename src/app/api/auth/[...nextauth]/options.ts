import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import connectDb from "@/lib/connnectdb";
import userModel from "@/models/user";

// Define the User type that matches NextAuth's expectations
interface User {
  id: string;
  _id: string;
  email: string;
  username: string;
  isVerified: boolean;
  isAcceptingMessage: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        await connectDb();

        try {
          const user = await userModel
            .findOne({
              $or: [
                { email: credentials.email },
                { username: credentials.email }
              ],
            })
            .lean();

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account first");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return {
              id: user._id.toString(), 
              _id: user._id.toString(),
              email: user.email,
              username: user.username,
              isVerified: user.isVerified,
              isAcceptingMessage: user.isAcceptingMessage,
            };
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (error) {
          console.error("Error during authorization:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session;
    },
  },
};