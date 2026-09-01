"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const passwordHash = await bcrypt.hash("Admin@123", 10);

        await queryInterface.bulkInsert("employees", [
            {
                name: "Admin",
                email: "admin@example.com",
                password_hash: passwordHash,
                role: "ADMIN",
                employee_code: `ADM-${Date.now()}`,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete(
            "employees",
            { email: "admin@example.com" }
        );
    }
};