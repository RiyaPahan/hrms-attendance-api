import { pool } from "../config/database";

export const punchIn = async (employeeId: number) => {
    const result = await pool.query(
        `
        INSERT INTO attendance
        (employee_id, date, punch_in, created_at, updated_at)
        VALUES ($1, CURRENT_DATE, NOW(), NOW(), NOW())
        RETURNING
            id,
            employee_id,
            date,
            punch_in,
            punch_out,
            created_at,
            updated_at
        `,
        [employeeId]
    );

    return result.rows[0];
};

export const getTodayAttendance = async (employeeId: number) => {
    const result = await pool.query(
        `
        SELECT
            id,
            employee_id,
            date,
            punch_in,
            punch_out,
            created_at,
            updated_at
        FROM attendance
        WHERE employee_id = $1
        AND date = CURRENT_DATE
        `,
        [employeeId]
    );

    return result.rows[0] || null;
};

export const punchOut = async (employeeId: number) => {
    const result = await pool.query(
        `
        UPDATE attendance
        SET
            punch_out = NOW(),
            updated_at = NOW()
        WHERE employee_id = $1
        AND date = CURRENT_DATE
        AND punch_in IS NOT NULL
        AND punch_out IS NULL
        RETURNING
            id,
            employee_id,
            date,
            punch_in,
            punch_out,
            created_at,
            updated_at
        `,
        [employeeId]
    );

    return result.rows[0] || null;
};

export const getMyAttendance = async (employeeId: number) => {
    const result = await pool.query(
        `
        SELECT
            id,
            employee_id,
            date,
            punch_in,
            punch_out,
            created_at,
            updated_at
        FROM attendance
        WHERE employee_id = $1
        ORDER BY date DESC
        `,
        [employeeId]
    );

    return result.rows;
};


export const getAdminAttendanceReport = async (
    from: string,
    to: string,
    employeeId?: number
) => {
    let query = `
        SELECT
            a.id,
            a.employee_id,
            e.name AS employee_name,
            e.employee_code,
            a.date,
            a.punch_in,
            a.punch_out,
            CASE
                WHEN a.punch_in IS NOT NULL
                AND a.punch_out IS NOT NULL
                THEN ROUND(
                    (
                        EXTRACT(
                            EPOCH FROM (a.punch_out - a.punch_in)
                        ) / 3600
                    )::numeric,
                    2
                )
                ELSE NULL
            END AS total_working_hours
        FROM attendance a
        INNER JOIN employees e
            ON e.id = a.employee_id
        WHERE a.date BETWEEN $1 AND $2
        AND e.role = 'EMPLOYEE'
    `;

    const values: (string | number)[] = [from, to];

    if (employeeId !== undefined) {
        query += ` AND a.employee_id = $3`;
        values.push(employeeId);
    }

    query += ` ORDER BY a.date DESC, e.id ASC`;

    const result = await pool.query(query, values);

    return result.rows;
};