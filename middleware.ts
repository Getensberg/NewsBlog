
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/admin/:path*"], // всё под /admin требует авторизации
};
