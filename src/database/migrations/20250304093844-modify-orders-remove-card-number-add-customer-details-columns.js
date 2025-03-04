'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove card_number
    await queryInterface.removeColumn('orders', 'card_number');

    // Remove customer_details
    await queryInterface.removeColumn('orders', 'customer_details');

    // Add individual customer detail columns
    await queryInterface.addColumn('orders', 'customer_name', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('orders', 'customer_email', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('orders', 'customer_phone', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('orders', 'customer_pan', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('orders', 'aadhaar_pincode', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('orders', 'aadhaar_yob', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('orders', 'aadhaar_gender', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert: Add back card_number and customer_details
    await queryInterface.addColumn('orders', 'card_number', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('orders', 'customer_details', {
      type: Sequelize.JSON,
      allowNull: true,
    });

    // Revert: Remove the new columns
    await queryInterface.removeColumn('orders', 'customer_name');
    await queryInterface.removeColumn('orders', 'customer_email');
    await queryInterface.removeColumn('orders', 'customer_phone');
    await queryInterface.removeColumn('orders', 'customer_pan');
    await queryInterface.removeColumn('orders', 'aadhaar_pincode');
    await queryInterface.removeColumn('orders', 'aadhaar_yob');
    await queryInterface.removeColumn('orders', 'aadhaar_gender');
  },
};