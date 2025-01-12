import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role?: string;
}

// Define protected routes
const PROTECTED_RESET_ROUTES = ["/auth/verify-otp", "/auth/new-password"];

export function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const encryptedToken = req.cookies.get("token")?.value || "";

  // Check different types of protected routes
  const isDashboardRoutes = pathname.startsWith("/dashboard");
  const isAccountsRoute = pathname.startsWith("/accounts");
  const isResetPasswordFlow = PROTECTED_RESET_ROUTES.includes(pathname);
  const isForgotPasswordRoute = pathname === "/auth/forgot-password";

  // Handle reset password flow protection
  if (isResetPasswordFlow || isForgotPasswordRoute) {
    const resetFlowToken = req.cookies.get("reset-flow-token")?.value;
    const resetEmail = req.cookies.get("reset-email")?.value;
    const otpVerified = req.cookies.get("otp-verified")?.value;

    // Protect forgot-password route from direct access if already in reset flow
    if (isForgotPasswordRoute && resetFlowToken && resetEmail) {
      return NextResponse.redirect(`${origin}/auth/verify-otp`);
    }

    // Protect verify-otp route
    if (pathname === "/auth/verify-otp") {
      if (!resetFlowToken || !resetEmail) {
        return NextResponse.redirect(`${origin}/auth/forgot-password`);
      }
      // If OTP is already verified, redirect to new-password
      if (otpVerified) {
        return NextResponse.redirect(`${origin}/auth/new-password`);
      }
    }

    // Protect new-password route
    if (pathname === "/auth/new-password") {
      if (!otpVerified) {
        return NextResponse.redirect(`${origin}/auth/verify-otp`);
      }
    }
  }

  // If no token exists and trying to access protected routes
  if (!encryptedToken) {
    // Protect accounts routes
    if (isAccountsRoute) {
      return NextResponse.redirect(`${origin}/auth/login`);
    }

    // Protect dashboard routes
    if (isDashboardRoutes) {
      return NextResponse.redirect(`${origin}/auth/login`);
    }
  } else {
    // User is logged in
    const decoded = jwtDecode<JwtPayload>(encryptedToken);

    // Handle dashboard access for non-admin users
    if (isDashboardRoutes && decoded?.role !== "admin") {
      return NextResponse.redirect(`${origin}`);
    }

    // Redirect logged in users away from login/register
    if (pathname === "/auth/login" || pathname === "/auth/register") {
      if (isDashboardRoutes && decoded?.role !== "admin") {
        return NextResponse.redirect(`${origin}`);
      }
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  return NextResponse.next();
}

// Update config to include accounts routes
export const config = {
  matcher: ["/dashboard/:path*", "/accounts/:path*", "/auth/:path*"],
};
