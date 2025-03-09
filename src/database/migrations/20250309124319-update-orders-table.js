'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the old `orders` table if it exists
    await queryInterface.dropTable('orders');

    // Create the new `orders` table
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
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
        allowNull: true,
      },
      purpose_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_esign_required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_v_kyc_required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
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
      order_status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      e_sign_status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      e_sign_link_status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      e_sign_link_expires: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      e_sign_completed_by_customer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      e_sign_customer_completion_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      e_sign_doc_comments: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      v_kyc_status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      v_kyc_link_status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      v_kyc_link_expires: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      v_kyc_completed_by_customer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      v_kyc_customer_completion_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      v_kyc_comments: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_esign_regenerated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_esign_regenerated_details: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      is_video_kyc_link_regenerated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_video_kyc_link_regenerated_details: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      checker_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Add foreign keys and relationships
    await queryInterface.addConstraint('orders', {
      fields: ['partner_id'],
      type: 'foreign key',
      name: 'fk_orders_partner',
      references: {
        table: 'partners',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('orders', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'fk_orders_created_by',
      references: {
        table: 'partners',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('orders', {
      fields: ['updated_by'],
      type: 'foreign key',
      name: 'fk_orders_updated_by',
      references: {
        table: 'partners',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('orders', {
      fields: ['checker_id'],
      type: 'foreign key',
      name: 'fk_orders_checker',
      references: {
        table: 'users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the newly created orders table if needed
    await queryInterface.dropTable('orders');
  },
};
