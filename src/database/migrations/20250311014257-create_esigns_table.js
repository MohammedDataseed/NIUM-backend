"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("esigns", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },      
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "orders", // Ensure "orders" is the correct table name
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
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("esigns");
  },
};
