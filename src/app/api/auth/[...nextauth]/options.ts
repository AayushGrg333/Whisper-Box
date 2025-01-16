import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import connectDb from "@/lib/connnectdb";
import userModel from "@/models/user";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Please provide all required fields");
        }

        try {
          await connectDb();

          const user = await userModel.findOne({
            $or: [
              { email: credentials.identifier.toLowerCase() },
              { username: credentials.identifier.toLowerCase() }
            ],
          }).lean();

          if (!user) {
            throw new Error("No account found with this email or username");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your email before signing in");
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) {
            throw new Error("Invalid password");
          }

          // Return only the necessary user data
          return {
            id: user._id.toString(),
            _id: user._id.toString(),
            email: user.email,
            username: user.username,
            isVerified: user.isVerified,
            isAcceptingMessage: user.isAcceptingMessage,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Auth error:", error.message);
            throw new Error(error.message || "Authentication failed");
          } else {
            console.error("Auth error:", error);
            throw new Error("Authentication failed");
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token._id = user._id;
        token.email = user.email;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
      }

      // Handle user updates
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user._id = token._id as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessage = token.isAcceptingMessage as boolean;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};