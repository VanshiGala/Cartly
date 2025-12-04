// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// //export { default } from "next-auth/middleware";

// export async function middleware(request: NextRequest) {
//   const token = await getToken({ req: request });
//   const url = request.nextUrl;

//   // If user is logged in and tries to access auth pages → redirect to home
//   if (
//     token &&
//     (url.pathname.startsWith("/sign-in") ||
//       url.pathname.startsWith("/sign-up"))
//   ) {
//     return NextResponse.redirect(new URL("/home", request.nextUrl.origin));
//   }

//   // If user is NOT logged in and tries to access protected pages → redirect to sign-in
//   if (!token && url.pathname.startsWith("/home")) {
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   // Otherwise allow request
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/home/:path*", "/sign-in","/sign-up"],
// };


import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // If user is logged in → block sign-in/sign-up
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up"))
  ) {
    return NextResponse.redirect(
      new URL("/home", request.url)
    );
  }

  // If user is NOT logged in → block /home
  if (!token && url.pathname.startsWith("/")) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/sign-in", "/sign-up"],
};


