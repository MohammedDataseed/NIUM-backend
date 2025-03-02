"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("partners", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "roles", // Ensure this matches the actual table name
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      api_key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      business_type: {
        type: Sequelize.ENUM("large_enterprise", "cash&carry"),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      created_by: {
        type: Sequelize.UUID,
        references: {
          model: "users", // Ensure this matches the actual table name
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      updated_by: {
        type: Sequelize.UUID,
        references: {
          model: "users", // Ensure this matches the actual table name
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("partners");
  },
};
