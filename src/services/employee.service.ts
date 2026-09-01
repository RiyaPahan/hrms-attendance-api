import bcrypt from "bcrypt";
import {
    getAllEmployees,
    findEmployeeByEmail,
    getEmployeeById,
    updateEmployee,
    createEmployee,
    deleteEmployee
} from "../repositories/employee.repository";

export const addEmployee = async (
    name: string,
    email: string,
    password: string
) => {
    const existingEmployee = await findEmployeeByEmail(email);

    if (existingEmployee) {
        return {
            error: "EMAIL_EXISTS"
        };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const employeeCode = `EMP-${Date.now()}`;

    const employee = await createEmployee(
        name,
        email,
        passwordHash,
        employeeCode
    );

    return {
        employee
    };
};


export const getEmployees = async () => {
    return await getAllEmployees();
};

export const getEmployee = async (id: number) => {
    return await getEmployeeById(id);
};

export const editEmployee = async (
    id: number,
    name?: string,
    email?: string
) => {
    return await updateEmployee(id, name, email);
};

export const removeEmployee = async (id: number) => {
    return await deleteEmployee(id);
};