"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("esigns", "partner_order_id", {
      type: Sequelize.STRING,
      allowNull: false, // Change to true if it can be optional
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("esigns", "partner_order_id");
  },
};
