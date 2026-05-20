import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { authConfig } from "@/auth.config";
import type { Role } from "@prisma/client";
import crypto from "crypto";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role: Role;
    };
  }
  interface User {
    role: Role;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
    Credentials({
      id: "telegram",
      name: "Telegram",
      credentials: {
        id: { type: "text" },
        first_name: { type: "text" },
        last_name: { type: "text" },
        username: { type: "text" },
        photo_url: { type: "text" },
        auth_date: { type: "text" },
        hash: { type: "text" },
      },
      async authorize(credentials) {
        const data = credentials as Record<string, string>;
        if (!verifyTelegramLogin(data)) return null;

        const telegramId = data.id;
        let user = await prisma.user.findUnique({ where: { telegramId } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              telegramId,
              telegramUsername: data.username ?? null,
              name: [data.first_name, data.last_name].filter(Boolean).join(" ") || data.username,
              image: data.photo_url ?? null,
            },
          });
        } else {
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              telegramUsername: data.username ?? user.telegramUsername,
              name: user.name ?? data.first_name,
              image: data.photo_url ?? user.image,
            },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    authorized: authConfig.callbacks?.authorized,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: Role }).role ?? "USER";
      } else if (token.id && !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        });
        if (dbUser) token.role = dbUser.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as Role) ?? "USER";
      }
      return session;
    },
  },
});

function verifyTelegramLogin(data: Record<string, string>): boolean {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken || !data.hash) return false;

  const { hash, ...rest } = data;
  const checkString = Object.keys(rest)
    .sort()
    .map((k) => `${k}=${rest[k]}`)
    .join("\n");

  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const hmac = crypto.createHmac("sha256", secretKey).update(checkString).digest("hex");

  if (hmac !== hash) return false;

  const authDate = parseInt(data.auth_date, 10);
  if (Date.now() / 1000 - authDate > 86400) return false;

  return true;
}
