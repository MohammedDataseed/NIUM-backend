'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      hashed_key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      partner_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      partner_order_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Ensuring unique partner order ID
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
      order_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      e_sign_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      e_sign_link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      e_sign_link_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      e_sign_link_doc_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      e_sign_link_request_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      e_sign_link_expires: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      e_sign_completed_by_customer: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      e_sign_customer_completion_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      e_sign_doc_comments: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      v_kyc_reference_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      v_kyc_profile_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      v_kyc_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      v_kyc_link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      v_kyc_link_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      v_kyc_link_expires: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      v_kyc_completed_by_customer: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      v_kyc_customer_completion_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      v_kyc_comments: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      incident_status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      incident_checker_comments: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nium_order_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nium_invoice_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      date_of_departure: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      incident_completion_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_esign_regenerated: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      is_esign_regenerated_details: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      is_video_kyc_link_regenerated: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      is_video_kyc_link_regenerated_details: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'partners',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'partners',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      checker_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      merged_document: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add unique index for hashed_key
    await queryInterface.addIndex('orders', ['hashed_key'], {
      unique: true,
      name: 'unique_order_hashed_key',
    });

    // ✅ Create Foreign Key Relationships with eSigns and Vkycs
    await queryInterface.addConstraint('esigns', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'fk_esigns_orders',
      references: {
        table: 'orders',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('vkycs', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'fk_vkycs_orders',
      references: {
        table: 'orders',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove foreign key constraints
    await queryInterface.removeConstraint('esigns', 'fk_esigns_orders');
    await queryInterface.removeConstraint('vkycs', 'fk_vkycs_orders');

    // Drop orders table
    await queryInterface.dropTable('orders');
  },
};
