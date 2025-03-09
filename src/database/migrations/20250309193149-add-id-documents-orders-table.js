module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("documents", {
      document_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      entity_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      entity_type: {
        type: Sequelize.ENUM("user", "customer"),
        allowNull: false,
      },
      purpose_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "purposes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      document_type_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "document_requirements",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      document_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      document_url: {
        type: Sequelize.JSON,
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
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
    await queryInterface.dropTable("documents");
  },
};
