"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("my_partners", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"), // Ensures UUID auto-generation
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
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Insert new data
    await queryInterface.bulkInsert("my_partners", [
      {
        id: Sequelize.literal("uuid_generate_v4()"),
        email: "partner1@company.com",
        password: "securePass1", // Consider hashing this
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal("uuid_generate_v4()"),
        email: "partner2@company.com",
        password: "securePass2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal("uuid_generate_v4()"),
        email: "partner3@company.com",
        password: "securePass3",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal("uuid_generate_v4()"),
        email: "partner4@company.com",
        password: "securePass4",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("my_partners");
  },
};
