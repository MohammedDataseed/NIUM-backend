'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'incident_status', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    });

    await queryInterface.addColumn('orders', 'incident_checker_comments', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('orders', 'nium_order_id', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('orders', 'nium_invoice_number', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('orders', 'date_of_departure', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('orders', 'incident_completion_date', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'incident_status');
    await queryInterface.removeColumn('orders', 'incident_checker_comments');
    await queryInterface.removeColumn('orders', 'nium_order_id');
    await queryInterface.removeColumn('orders', 'nium_invoice_number');
    await queryInterface.removeColumn('orders', 'date_of_departure');
    await queryInterface.removeColumn('orders', 'incident_completion_date');
  }
};
