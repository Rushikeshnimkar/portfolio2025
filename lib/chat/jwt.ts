import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
}
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || "1m";

export function verifyToken(token: string): {
    valid: boolean;
    payload?: string | jwt.JwtPayload;
    error?: string;
} {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return { valid: true, payload: decoded };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return { valid: false, error: "Token expired" };
        } else if (error instanceof jwt.JsonWebTokenError) {
            return { valid: false, error: "Invalid token" };
        } else {
            return { valid: false, error: "Token verification failed" };
        }
    }
}

export function generateToken(payload: string | object | Buffer): string {
    const options = {
        expiresIn: JWT_EXPIRY,
    } as jwt.SignOptions;

    return jwt.sign(payload, JWT_SECRET, options);
}

