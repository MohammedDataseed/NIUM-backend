'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column 'v_kyc_reference_id' already exists
    const columns = await queryInterface.describeTable('orders');

    // Add 'v_kyc_reference_id' column if it doesn't exist
    if (!columns['v_kyc_reference_id']) {
      await queryInterface.addColumn('orders', 'v_kyc_reference_id', {
        type: Sequelize.STRING,
        allowNull: true,  // Allow null initially
      });
    }

    // Add 'v_kyc_profile_id' column if it doesn't exist
    if (!columns['v_kyc_profile_id']) {
      await queryInterface.addColumn('orders', 'v_kyc_profile_id', {
        type: Sequelize.STRING,
        allowNull: true,  // Allow null initially
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the columns in case of rollback
    await queryInterface.removeColumn('orders', 'v_kyc_reference_id');
    await queryInterface.removeColumn('orders', 'v_kyc_profile_id');
  }
};
