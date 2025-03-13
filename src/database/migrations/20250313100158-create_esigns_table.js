"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("esigns", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      hashed_key: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      attempt_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      task_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      group_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      esign_file_details: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      esign_stamp_details: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      esign_invitees: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      esign_details: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      esign_doc_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      request_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      esign_expiry: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      expired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      rejected: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      result: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      esigners: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      file_details: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      request_details: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      esign_irn: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      esign_folder: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      esign_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      esign_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      esigner_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      esigner_phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_signed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("esigns");
  },
};
