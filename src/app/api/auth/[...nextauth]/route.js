import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import User from "@/models/User";
import Assessment from "@/models/Assessment";
import { connectDB } from "@/lib/db";
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        await connectDB();

        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            password: null,
          });
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        return token;
      }

      if (token.email && !token.id) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser?._id) {
            token.id = dbUser._id.toString();
          } else {
            console.warn(
              `[NextAuth] User lookup failed for email: ${token.email}`,
            );
          }
        } catch (error) {
          console.error("[NextAuth JWT] Database error:", error.message);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;

        await connectDB();
        const assessment = await Assessment.findOne({
          userId: token.id,
        }).lean();

        session.user.hasAssessment = !!assessment;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
