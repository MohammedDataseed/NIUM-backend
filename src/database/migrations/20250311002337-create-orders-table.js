module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
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
      order_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      e_sign_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      e_sign_link_status: {
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
      v_kyc_status: {
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
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      checker_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      merged_document: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("orders");
  },
};
