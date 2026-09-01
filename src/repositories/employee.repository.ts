import { pool } from "../config/database";

export const findEmployeeByEmail = async (email: string) => {
    const result = await pool.query(
        `
        SELECT id, name, email, password_hash, role, employee_code
        FROM employees
        WHERE email = $1
        `,
        [email]
    );

    return result.rows[0] || null;
};

export const createEmployee = async (
    name: string,
    email: string,
    passwordHash: string,
    employeeCode: string
) => {
    const result = await pool.query(
        `
        INSERT INTO employees
        (name, email, password_hash, role, employee_code, created_at, updated_at)
        VALUES ($1, $2, $3, 'EMPLOYEE', $4, NOW(), NOW())
        RETURNING
            id,
            name,
            email,
            role,
            employee_code,
            created_at,
            updated_at
        `,
        [
            name,
            email,
            passwordHash,
            employeeCode
        ]
    );

    return result.rows[0];
};


export const getAllEmployees = async () => {
    const result = await pool.query(`
        SELECT
            id,
            name,
            email,
            role,
            employee_code,
            created_at,
            updated_at
        FROM employees
        WHERE role = 'EMPLOYEE'
        ORDER BY id DESC
    `);

    return result.rows;
};

export const getEmployeeById = async (id: number) => {
    const result = await pool.query(
        `
        SELECT
            id,
            name,
            email,
            role,
            employee_code,
            created_at,
            updated_at
        FROM employees
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

export const updateEmployee = async (
    id: number,
    name?: string,
    email?: string
) => {
    const result = await pool.query(
        `
        UPDATE employees
        SET
            name = COALESCE($1, name),
            email = COALESCE($2, email),
            updated_at = NOW()
        WHERE id = $3
        RETURNING
            id,
            name,
            email,
            role,
            employee_code,
            created_at,
            updated_at
        `,
        [name || null, email || null, id]
    );

    return result.rows[0] || null;
};

export const deleteEmployee = async (id: number) => {
    const result = await pool.query(
        `
        DELETE FROM employees
        WHERE id = $1
        RETURNING id
        `,
        [id]
    );

    return result.rows[0] || null;
};