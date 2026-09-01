import {
    punchIn as punchInRepository,
    getTodayAttendance,
    punchOut as punchOutRepository,
    getMyAttendance,
    getAdminAttendanceReport
} from "../repositories/attendence.repository";

export const punchIn = async (employeeId: number) => {

    const existingAttendance = await getTodayAttendance(employeeId);

    if (existingAttendance) {
        return {
            error: "ALREADY_PUNCHED_IN"
        };
    }

    try {
        const attendance = await punchInRepository(employeeId);

        return {
            attendance
        };
    } catch (error: any) {

        // PostgreSQL unique violation
        if (error.code === "23505") {
            return {
                error: "ALREADY_PUNCHED_IN"
            };
        }

        throw error;
    }
};

export const punchOut = async (employeeId: number) => {

    const attendance = await getTodayAttendance(employeeId);

    if (!attendance) {
        return {
            error: "NOT_PUNCHED_IN"
        };
    }

    if (!attendance.punch_in) {
        return {
            error: "NOT_PUNCHED_IN"
        };
    }

    if (attendance.punch_out) {
        return {
            error: "ALREADY_PUNCHED_OUT"
        };
    }

    const result = await punchOutRepository(employeeId);

    return {
        attendance: result
    };
};

export const getMyAttendanceHistory = async (
    employeeId: number
) => {
    return await getMyAttendance(employeeId);
};


export const getAttendanceReport = async (
    from: string,
    to: string,
    employeeId?: number
) => {
    return await getAdminAttendanceReport(
        from,
        to,
        employeeId
    );
};