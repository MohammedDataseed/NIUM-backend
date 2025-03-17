"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("orders", "partner_id", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Ensure invalid UUIDs are handled before converting back
    await queryInterface.sequelize.query(`
      UPDATE orders
      SET partner_id = NULL
      WHERE partner_id !~ '^[0-9a-fA-F-]{36}$';
    `);

    await queryInterface.changeColumn("orders", "partner_id", {
      type: Sequelize.UUID,
      allowNull: false,
    });
  },
};
