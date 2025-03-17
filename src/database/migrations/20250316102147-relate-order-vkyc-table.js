// migrations/xxxxxx-update-order.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Since the foreign key 'order_id' already exists in 'vkycs',
    // this migration doesn't need to modify the 'orders' table.
    // However, we should ensure there are no changes required here.
    // You might not need any changes for the orders table itself.

    // In case you need to add a custom index for efficient queries between orders and vkycs:
    await queryInterface.addIndex('vkycs', ['order_id']);  // Index for performance
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback the index change if needed
    await queryInterface.removeIndex('vkycs', ['order_id']);
  }
};
