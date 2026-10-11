  import NextAuth from "next-auth";
  import GoogleProvider from "next-auth/providers/google";
  import GitHubProvider from "next-auth/providers/github";
  import CredentialsProvider from "next-auth/providers/credentials";
  import bcrypt from "bcryptjs";
  import mongoose from "mongoose";

  import User from "@/models/User";
  import Assessment from "@/models/Assessment";
  import { connectDB } from "@/lib/db";
  import { analyzeGitHubProfile } from "@/lib/github";

  export const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),

      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
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
      async signIn({ user, account, profile }) {
        try {
          if (!account?.provider || !user?.email) {
            console.error("[nextauth/signIn] Missing provider or user email");
            return false;
          }

          await connectDB();
          console.log("[nextauth/signIn] Database connection ready", {
            provider: account.provider,
            hasGoogleCredentials:
              Boolean(process.env.GOOGLE_CLIENT_ID) &&
              Boolean(process.env.GOOGLE_CLIENT_SECRET),
            hasMongoUri: Boolean(process.env.MONGODB_URI),
          });

          if (account.provider === "google") {
            let existingUser = await User.findOne({ email: user.email });
            if (!existingUser) {
              existingUser = await User.create({
                name: user.name,
                email: user.email,
                password: null,
                authProvider: "google",
              });
            } else if (!existingUser.authProvider) {
              existingUser.authProvider = "google";
              await existingUser.save();
            }

            // Use the MongoDB ID in the JWT, not Google's provider account ID.
            user.id = existingUser._id.toString();
          } else if (account.provider === "github") {
            const existingUser = await User.findOne({ email: user.email });
            const githubUsername = profile?.login || user.name;
            let githubUser;

            if (!existingUser) {
              githubUser = await User.create({
                name: user.name,
                email: user.email,
                githubId: account.providerAccountId,
                githubUsername,
                githubToken: account.access_token,
                githubConnected: true,
                authProvider: "github",
              });
            } else {
              githubUser = await User.findByIdAndUpdate(
                existingUser._id,
                {
                  githubId: account.providerAccountId,
                  githubUsername,
                  githubToken: account.access_token,
                  githubConnected: true,
                  authProvider: existingUser.authProvider || "github",
                },
                { new: true },
              );
            }

            user.id = githubUser._id.toString();

            // Analyze GitHub profile asynchronously after authentication succeeds.
            analyzeGitHubProfile(githubUser._id.toString(), account.access_token).catch(
              (err) => console.error("GitHub analysis failed:", err)
            );
          }

          return true;
        } catch (error) {
          console.error("[nextauth/signIn] Provider callback failed", {
            provider: account?.provider,
            message: error instanceof Error ? error.message : String(error),
          });
          return false;
        }
      },

      async jwt({ token, user }) {
        if (user?.id) {
          token.id = user.id;
          return token;
        }

        if (token.email && !mongoose.Types.ObjectId.isValid(token.id)) {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
          }
        }

        return token;
      },

      async session({ session, token }) {
        if (!session.user) return session;

        try {
          await connectDB();

          const dbUser = mongoose.Types.ObjectId.isValid(token.id)
            ? await User.findById(token.id).lean()
            : await User.findOne({ email: session.user.email }).lean();

          if (!dbUser) {
            console.error("[nextauth/session] User record not found", {
              hasTokenId: Boolean(token.id),
              hasEmail: Boolean(session.user.email),
            });
            return session;
          }

          session.user.id = dbUser._id.toString();
          session.user.hasAssessment = !!await Assessment.findOne({
            userId: dbUser._id,
          }).lean();
          session.user.githubConnected = dbUser.githubConnected;
          session.user.githubData = dbUser.githubData;
          session.user.authProvider = dbUser.authProvider;
          session.user.githubUsername = dbUser.githubUsername;
        } catch (error) {
          console.error("[nextauth/session] Failed to build session", {
            message: error instanceof Error ? error.message : String(error),
          });
        }

        return session;
      },
    },

    secret: process.env.NEXTAUTH_SECRET,
    pages: { signIn: "/login" },
  };

  const handler = NextAuth(authOptions);

  export { handler as GET, handler as POST };
