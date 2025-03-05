'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      partner_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      transaction_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      purpose_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isEsignRequired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isVkycRequired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      // Customer Details
      customer_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customer_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customer_phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customer_pan: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // Aadhaar Details
      aadhaar_pincode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      aadhaar_yob: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      aadhaar_gender: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // Timestamps & User Tracking
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users', // Reference to users table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users', // Reference to users table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  },
};
