"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
   

    // Ensure hashed_key is not null
    await queryInterface.changeColumn("esigns", "hashed_key", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    
    // Revert hashed_key change if needed
    await queryInterface.changeColumn("esigns", "hashed_key", {
      type: Sequelize.STRING,
      allowNull: true, // Allow null (only if it was originally nullable)
    });
  },
};
