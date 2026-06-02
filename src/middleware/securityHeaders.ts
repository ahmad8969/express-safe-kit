import type { RequestHandler } from "express";
import type { SecurityHeadersOptions } from "../types";

const buildHstsValue = (hsts: SecurityHeadersOptions["hsts"]): string => {
  const parts = [`max-age=${hsts.maxAge}`];
  if (hsts.includeSubDomains) {
    parts.push("includeSubDomains");
  }
  if (hsts.preload) {
    parts.push("preload");
  }
  return parts.join("; ");
};

export const securityHeaders = (
  options: SecurityHeadersOptions
): RequestHandler => {
  const csp =
    options.contentSecurityPolicy.trim().length > 0
      ? options.contentSecurityPolicy
      : null;
  const hstsEnabled = options.hsts.enabled;
  const hstsValue = hstsEnabled ? buildHstsValue(options.hsts) : null;

  return (req, res, next) => {
    res.removeHeader("X-Powered-By");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-DNS-Prefetch-Control", "off");
    res.setHeader("X-Download-Options", "noopen");
    res.setHeader("X-Permitted-Cross-Domain-Policies", "none");

    if (csp) {
      res.setHeader("Content-Security-Policy", csp);
    }

    if (hstsValue) {
      const forwardedProto = req.headers["x-forwarded-proto"];
      const isSecure =
        req.secure ||
        (typeof forwardedProto === "string" &&
          forwardedProto.toLowerCase().includes("https"));

      if (isSecure) {
        res.setHeader("Strict-Transport-Security", hstsValue);
      }
    }

    next();
  };
};
