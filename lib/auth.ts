import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createHash, timingSafeEqual } from "node:crypto";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Agent Password",
      credentials: {
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const password = credentials?.password;
        const expectedPassword = process.env.AGENT_PASSWORD;

        if (!password || !expectedPassword) {
          return null;
        }

        const passwordHash = createHash("sha256").update(password).digest();
        const expectedHash = createHash("sha256").update(expectedPassword).digest();

        if (passwordHash.length === expectedHash.length && timingSafeEqual(passwordHash, expectedHash)) {
          return { id: "1", name: "Commander" };
        }

        return null;
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
};
