'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vkycs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, // ✅ Using Sequelize's built-in UUIDV4
        primaryKey: true,
        allowNull: false,
      },
      hashed_key: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      partner_order_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'orders', // ✅ Foreign Key reference to `orders` table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      attempt_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      reference_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      profile_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      v_kyc_link: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      v_kyc_link_expires: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      v_kyc_link_status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      v_kyc_comments: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      v_kyc_doc_completion_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      device_info: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      profile_data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      performed_by: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      resources_documents: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      resources_images: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      resources_videos: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      resources_text: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      location_info: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reviewer_action: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tasks: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status_description: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      status_detail: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.UUID,
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

    // ✅ Ensure hashed_key is UNIQUE
    await queryInterface.addIndex('vkycs', ['hashed_key'], {
      unique: true,
      name: 'unique_vkyc_hashed_key',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vkycs');
  },
};
