"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hashed_key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      role_id: {
        type: Sequelize.STRING, // Change to string
        allowNull: false,
        references: {
          model: "roles",
          key: "hashed_key", // Ensure "roles" table has "hashed_key"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      branch_id: {
        type: Sequelize.STRING, // Change to string
        allowNull: false,
        references: {
          model: "branches",
          key: "hashed_key", // Ensure "branches" table has "hashed_key"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      bank_account_id: {
        type: Sequelize.STRING, // Change to string
        allowNull: true,
        references: {
          model: "bank_accounts",
          key: "hashed_key", // Ensure "bank_accounts" table has "hashed_key"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      business_type: {
        type: Sequelize.ENUM("cash&carry", "large_enterprise"),
        allowNull: false,
      },
      created_by: {
        type: Sequelize.STRING, // Change to string
        allowNull: true,
        references: {
          model: "users",
          key: "hashed_key", // Ensure "users" table has "hashed_key"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      updated_by: {
        type: Sequelize.STRING, // Change to string
        allowNull: true,
        references: {
          model: "users",
          key: "hashed_key", // Ensure "users" table has "hashed_key"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};
