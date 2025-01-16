import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import connectDb from "@/lib/connnectdb";
import userModel from "@/models/user";
import GoogleProvider from "next-auth/providers/google";
import { Message } from "@/models/user";
// Add this interface at the top of the file
interface UserDocument {
  _id: string;
  email: string;
  username: string;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
  password?: string;
}

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

                    const user = await userModel
                        .findOne({
                            $or: [
                                { email: credentials.identifier.toLowerCase() },
                                {
                                    username:
                                        credentials.identifier.toLowerCase(),
                                },
                            ],
                        })
                        .lean();

                    if (!user) {
                        throw new Error(
                            "No account found with this email or username"
                        );
                    }

                    if (!user.isVerified) {
                        throw new Error(
                            "Please verify your email before signing in"
                        );
                    }

                    const passwordMatch = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!passwordMatch) {
                        throw new Error("Invalid password");
                    }

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
                        throw new Error(
                            error.message || "Authentication failed"
                        );
                    } else {
                        console.error("Auth error:", error);
                        throw new Error("Authentication failed");
                    }
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
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
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          if (profile?.email) {
            await connectDb();

            const dbUser = await userModel.findOne({
              email: profile.email,
            }).lean() as UserDocument | null;

            if (!dbUser) {
              // Create new user with all required fields
              const newUser = await userModel.create({
                username: profile.email.split("@")[0],
                email: profile.email,
                isVerified: true,
                isAcceptingMessage: true,
                messages: [],
                password: 'GOOGLE_OAUTH_' + Math.random().toString(36), 
                verifyCode: 'GOOGLE_OAUTH', 
                verifyCodeExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set to 24h in future
              }) as UserDocument;

              user.id = newUser._id.toString();
              user._id = newUser._id.toString();
              user.email = newUser.email;
              user.username = newUser.username;
              user.isVerified = newUser.isVerified;
              user.isAcceptingMessage = newUser.isAcceptingMessage;
            } else {
              // Important: Modify the user object with existing user's data
              user.id = dbUser._id.toString();
              user._id = dbUser._id.toString();
              user.email = dbUser.email;
              user.username = dbUser.username;
              user.isVerified = dbUser.isVerified;
              user.isAcceptingMessage = dbUser.isAcceptingMessage;
            }
            return true;
          }
        }
        return true;
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token._id = user._id;
        token.email = user.email;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
      }

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
                session.user.isAcceptingMessage =
                    token.isAcceptingMessage as boolean;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
