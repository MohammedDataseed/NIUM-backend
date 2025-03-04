'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      partner_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      transaction_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      card_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      purpose_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_esign_required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      is_vkyc_required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      customer_details: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      kyc_document: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      request_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      task_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      group_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      action: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('completed', 'failed', 'pending'),
        defaultValue: 'pending',
        allowNull: true,
      },
      ekyc_response_data: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  },
};