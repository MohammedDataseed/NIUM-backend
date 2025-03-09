// migrations/20250309-create-orders-table.js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      partner_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'partners',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      order_id: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      transaction_type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      purpose_type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      is_esign_required: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_v_kyc_required: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      customer_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      customer_email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      customer_phone: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      customer_pan: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      aadhaar_pincode: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      aadhaar_yob: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      aadhaar_gender: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      order_status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      e_sign_status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      e_sign_link_status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      e_sign_link_expires: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      e_sign_completed_by_customer: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
      e_sign_customer_completion_date: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      e_sign_doc_comments: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      v_kyc_status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      v_kyc_link_status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      v_kyc_link_expires: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      v_kyc_completed_by_customer: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
      v_kyc_customer_completion_date: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      v_kyc_comments: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      is_esign_regenerated: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_esign_regenerated_details: {
        type: Sequelize.DataTypes.JSONB,
        allowNull: true,
      },
      is_video_kyc_link_regenerated: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_video_kyc_link_regenerated_details: {
        type: Sequelize.DataTypes.JSONB,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'partners',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      updated_by: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'partners',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      checker_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.DataTypes.NOW,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.DataTypes.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  },
};