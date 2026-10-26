import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./database/drizzle";
import { users } from "./database/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,

  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Check that both fields exist
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email.toString()))
          .limit(1);

        if (user.length === 0) {
          return null;
        }

        const isPasswordCorrect = await compare(
          credentials.password.toString(),
          user[0].password
        );

        if (!isPasswordCorrect) {
          return null;
        }

        return {
          id: user[0].id,
          name: user[0].fullName,
          email: user[0].email,
          role: user[0].role,
        } as User;
      },
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // not users.id
        token.name = user.name;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.role = token.role as "ADMIN" | "USER" | null;
      }

      return session;
    },
  },
});