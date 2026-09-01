import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

import {
    punchIn as punchInService,
    punchOut as punchOutService,
    getMyAttendanceHistory,
    getAttendanceReport,
} from "../services/attendence.service"

export const punchIn = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {

        const employeeId = req.user!.id;

        const result = await punchInService(employeeId);

        if (result.error === "ALREADY_PUNCHED_IN") {
            return res.status(409).json({
                success: false,
                message: "Employee has already punched in."
            });
        }

        return res.status(201).json({
            success: true,
            data: result.attendance
        });

    } catch (error) {
        next(error);
    }
};

export const punchOut = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {

        const employeeId = req.user!.id;

        const result = await punchOutService(employeeId);

        if (result.error === "NOT_PUNCHED_IN") {
            return res.status(400).json({
                success: false,
                message: "Employee has not punched in."
            });
        }

        if (result.error === "ALREADY_PUNCHED_OUT") {
            return res.status(409).json({
                success: false,
                message: "Employee has already punched out."
            });
        }

        return res.status(200).json({
            success: true,
            data: result.attendance
        });

    } catch (error) {
        next(error);
    }
};

export const myAttendance = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {

        const employeeId = req.user!.id;

        const attendance =
            await getMyAttendanceHistory(employeeId);

        return res.status(200).json({
            success: true,
            data: attendance
        });

    } catch (error) {
        next(error);
    }
};

export const adminAttendanceReport = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { from, to, employeeId } = req.query;

        if (!from || !to) {
            return res.status(400).json({
                success: false,
                message: "from and to are required"
            });
        }

        const report = await getAttendanceReport(
            from as string,
            to as string,
            employeeId ? Number(employeeId) : undefined
        );

        return res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {
        next(error);
    }
};