import { Request, Response, NextFunction } from "express";
import { loginUser } from "../services/auth.service";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

         if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const result = await loginUser(email, password);

        if (result === null) {
            return res.status(404).json({
                success: false,
                message: "User does not exist"
            });
        }

        if (result === false) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};