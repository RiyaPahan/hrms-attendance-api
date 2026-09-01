import bcrypt from "bcrypt";
import { pool } from "../config/database";
import { generateToken } from "../utils/jwt";

export const loginUser = async (
    email: string,
    password: string
) => {

    const result = await pool.query(
        `
        SELECT id, name, email, password_hash, role, employee_code
        FROM employees
        WHERE email = $1
        `,
        [email]
    );

    if (result.rows.length === 0) {
       return null;
    }

    const employee = result.rows[0];

    const isPasswordValid = await bcrypt.compare(
        password,
        employee.password_hash
    );

    if (!isPasswordValid) {
        return false;
    }

    const token = generateToken({
        id: employee.id,
        email: employee.email,
        role: employee.role,
    });

    return {
        token,
        employee: {
            id: employee.id,
            name: employee.name,
            email: employee.email,
            role: employee.role,
            employee_code: employee.employee_code,
        },
    };
};