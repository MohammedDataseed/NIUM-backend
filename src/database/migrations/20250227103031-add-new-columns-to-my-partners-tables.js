"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add two new columns
    await queryInterface.addColumn("my_partners", "phone_number", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("my_partners", "company_name", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Insert new data into the newly added columns
    await queryInterface.bulkUpdate("my_partners", 
      {
        phone_number: "1234567890",
        company_name: "Company ABC"
      },
      {} // Empty object means it will update all rows
    );
  },

  async down(queryInterface, Sequelize) {
    // Remove the columns if rolling back
    await queryInterface.removeColumn("my_partners", "phone_number");
    await queryInterface.removeColumn("my_partners", "company_name");
  }
};
