import { Request, Response, NextFunction } from "express";
import { addEmployee, getEmployees , getEmployee, editEmployee, removeEmployee } from "../services/employee.service";

export const createEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password are required"
            });
        }

        const result = await addEmployee(
            name,
            email,
            password
        );

        if ("error" in result && result.error === "EMAIL_EXISTS") {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        return res.status(201).json({
            success: true,
            data: result.employee
        });

    } catch (error) {
        next(error);
    }
};


export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const employees = await getEmployees();

        return res.status(200).json({
            success: true,
            data: employees
        });
    } catch (error) {
        next(error);
    }
};

export const getById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid employee ID"
            });
        }

        const employee = await getEmployee(id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: employee
        });
    } catch (error) {
        next(error);
    }
};


export const update = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid employee ID"
            });
        }

        const { name, email } = req.body;


        const employee = await editEmployee(
            id,
            name,
            email
        );

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: employee
        });

    } catch (error) {
        next(error);
    }
};


export const remove = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid employee ID"
            });
        }

        const employee = await removeEmployee(id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};