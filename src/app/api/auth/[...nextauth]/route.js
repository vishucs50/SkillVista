  import NextAuth from "next-auth";
  import GoogleProvider from "next-auth/providers/google";
  import GitHubProvider from "next-auth/providers/github";
  import CredentialsProvider from "next-auth/providers/credentials";
  import bcrypt from "bcryptjs";

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
        await connectDB();

        if (account.provider === "google") {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              password: null,
              authProvider: "google",
            });
          } else if (!existingUser.authProvider) {
            existingUser.authProvider = "google";
            await existingUser.save();
          }
        }

        if (account.provider === "github") {
          const existingUser = await User.findOne({ email: user.email });
          const githubUsername = profile.login ;

          if (!existingUser) {
            // Create new user with GitHub data
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              password: null,
              githubId: account.providerAccountId,
              githubUsername: githubUsername,
              githubToken: account.access_token,
              githubConnected: true,
              authProvider: "github",
            });
            user.id = newUser._id.toString();

            // Analyze GitHub profile async (non-blocking)
            analyzeGitHubProfile(newUser._id.toString(), account.access_token).catch(
              (err) => console.error("GitHub analysis failed:", err)
            );
          } else {
            // Update existing user with GitHub data if not already connected
            const updated = await User.findByIdAndUpdate(
              existingUser._id,
              {
                githubId: account.providerAccountId,
                githubUsername: githubUsername,
                githubToken: account.access_token,
                githubConnected: true,
                authProvider: existingUser.authProvider || "github",
              },
              { new: true }
            );
            user.id = updated._id.toString();

            // Analyze GitHub profile async
            analyzeGitHubProfile(updated._id.toString(), account.access_token).catch(
              (err) => console.error("GitHub analysis failed:", err)
            );
          }
        }

        return true;
      },

      async jwt({ token, user }) {
        if (user?.id) {
          token.id = user.id;
          return token;
        }

        if (token.email) {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
          }
        }

        return token;
      },

      async session({ session, token }) {
        if (session.user && token.id) {
          session.user.id = token.id;

          await connectDB();
          const dbUser = await User.findById(token.id).lean();

          if (dbUser) {
            session.user.hasAssessment = !!await Assessment.findOne({
              userId: token.id,
            }).lean();
            session.user.githubConnected = dbUser.githubConnected;
            session.user.githubData = dbUser.githubData;
            session.user.authProvider = dbUser.authProvider;
            session.user.githubToken = dbUser.githubToken;
            session.user.githubUsername = dbUser.githubUsername;
          }
        }

        return session;
      },
    },

    secret: process.env.NEXTAUTH_SECRET,
    pages: { signIn: "/login" },
  };

  const handler = NextAuth(authOptions);

  export { handler as GET, handler as POST };
