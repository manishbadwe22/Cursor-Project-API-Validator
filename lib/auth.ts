import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const devAuthUsername = process.env.DEV_AUTH_USERNAME ?? "dev";
const devAuthPassword = process.env.DEV_AUTH_PASSWORD ?? "dev1234";
const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    id: "credentials",
    name: "Dev Credentials",
    credentials: {
      username: { label: "Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const username = credentials?.username?.trim() ?? "";
      const password = credentials?.password ?? "";

      if (username === devAuthUsername && password === devAuthPassword) {
        return {
          id: "dev-user",
          name: "Developer User",
          email: "dev@local",
        };
      }
      return null;
    },
  }),
];

if (googleClientId && googleClientSecret) {
  providers.unshift(
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    })
  );
} else if (process.env.NODE_ENV !== "production") {
  console.warn(
    "[next-auth] Google provider is disabled: GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET missing."
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
      }
      return session;
    },
  },
};
