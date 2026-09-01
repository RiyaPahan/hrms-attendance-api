import jwt from "jsonwebtoken";

interface JwtPayload {
    id: number;
    email: string;
    role: string;
}

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET as string,
        {
            expiresIn: process.env.JWT_EXPIRES_IN as any
        }
    );
};