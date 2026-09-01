module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("attendance", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "employees",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      punch_in: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      punch_out: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // Prevent duplicate attendance for the same employee on the same date
    await queryInterface.addConstraint("attendance", {
      fields: ["employee_id", "date"],
      type: "unique",
      name: "unique_employee_attendance_date",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("attendance");
  },
};