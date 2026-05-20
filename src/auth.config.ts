import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;

      const isAdmin = pathname.startsWith("/admin");
      const isDashboard = pathname.startsWith("/dashboard");
      const isAuthPage = ["/login", "/register", "/forgot-password"].includes(pathname);

      if ((isAdmin || isDashboard) && !isLoggedIn) {
        return false;
      }

      if (isAdmin && role !== "ADMIN") {
        return Response.redirect(new URL("/dashboard", request.nextUrl));
      }

      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", request.nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "USER";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "USER" | "ADMIN") ?? "USER";
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
