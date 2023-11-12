// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import i18n from "../../i18n.json";

// /es/page-name -> rewrites to -> /es/page-name?lang=es
export function middleware(request: NextRequest) {
  const locale = request.nextUrl.locale || i18n.defaultLocale;
  return NextResponse.rewrite(request.nextUrl);
}
