import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CognitoJwtVerifier } from "aws-jwt-verify";

interface DecodedToken extends JwtPayload {
  sub: string;
  "custom:role"?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

/**
 * When Cognito is configured, tokens are cryptographically verified against
 * the user pool's JWKS. Without it (local development) tokens are only
 * decoded — never run that mode in production.
 */
const { COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID } = process.env;

const verifier =
  COGNITO_USER_POOL_ID && COGNITO_CLIENT_ID
    ? CognitoJwtVerifier.create({
        userPoolId: COGNITO_USER_POOL_ID,
        clientId: COGNITO_CLIENT_ID,
        tokenUse: "id",
      })
    : null;

if (!verifier) {
  console.warn(
    "[auth] COGNITO_USER_POOL_ID / COGNITO_CLIENT_ID not set — JWTs are decoded WITHOUT signature verification. Do not use in production.",
  );
}

async function readToken(token: string): Promise<DecodedToken> {
  if (verifier) {
    const payload = await verifier.verify(token);
    return payload as unknown as DecodedToken;
  }
  const decoded = jwt.decode(token) as DecodedToken | null;
  if (!decoded || !decoded.sub) throw new Error("Malformed token");
  return decoded;
}

export const authMiddleware = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let decoded: DecodedToken;
    try {
      decoded = await readToken(token);
    } catch (err) {
      console.error("Failed to verify token:", err);
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    const userRole = (decoded["custom:role"] || "").toLowerCase();
    req.user = { id: decoded.sub, role: userRole };

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({ message: "Access Denied" });
      return;
    }

    next();
  };
};
