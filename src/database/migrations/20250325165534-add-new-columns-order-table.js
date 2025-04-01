'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'partner_hashed_api_key', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('orders', 'partner_hashed_key', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Update existing records with default values
    await queryInterface.sequelize.query(`
      UPDATE orders
      SET partner_hashed_key = '10015708d01298cbc484b7d042318629m8cuy1r3',
          partner_hashed_api_key = '7e563fd4-e6a7-4393-9541-555ccba0faf6'
      WHERE partner_hashed_key IS NULL OR partner_hashed_api_key IS NULL
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'partner_hashed_api_key');
    await queryInterface.removeColumn('orders', 'partner_hashed_key');
  }
};
