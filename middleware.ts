// Middleware — protege /admin salvo la pantalla de login.
// La validación real del token vive en lib/admin-auth (Node runtime); aquí
// solo bloqueamos rápido si no hay cookie de sesión.
import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin/login") || pathname === "/admin/login") {
    return NextResponse.next();
  }
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
