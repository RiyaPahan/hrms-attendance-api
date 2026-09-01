'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("employees", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            name: {
                type: Sequelize.STRING,
                allowNull: false
            },

            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },

            password_hash: {
                type: Sequelize.STRING,
                allowNull: false
            },

            role: {
                type: Sequelize.ENUM("ADMIN", "EMPLOYEE"),
                allowNull: false,
                defaultValue: "EMPLOYEE"
            },

            employee_code: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW")
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW")
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("employees");
    }
};