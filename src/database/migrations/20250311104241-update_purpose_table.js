"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("purposes", "hashed_key", {
      type: Sequelize.STRING,
      allowNull: true, // Allow NULL initially
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("purposes", "hashed_key", {
      type: Sequelize.STRING,
      allowNull: false, // Revert back if rolling back
      unique: true,
    });
  },
};
