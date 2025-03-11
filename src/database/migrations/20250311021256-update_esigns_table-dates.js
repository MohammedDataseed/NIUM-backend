"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the 'id' column to the 'esigns' table
    await queryInterface.addColumn("esigns", "id", {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4, // Use Sequelize's UUIDV4 generator
      allowNull: false,
      primaryKey: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the 'id' column in case of rollback
    await queryInterface.removeColumn("esigns", "id");
  },
};