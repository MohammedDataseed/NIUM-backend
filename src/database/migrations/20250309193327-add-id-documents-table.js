"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("documents", {
      document_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      entity_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      entity_type: {
        type: Sequelize.ENUM("user", "customer"),
        allowNull: false,
      },
      purpose_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "purposes", key: "id" },
      },
      document_type_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "document_requirements", key: "id" },
      },
      document_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      document_url: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
      document_expiry: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_doc_front_image: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_doc_back_image: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_uploaded: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_customer: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("documents");
  },
};
