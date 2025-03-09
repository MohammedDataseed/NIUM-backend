'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('documents', {
      document_id: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      entity_id: {
        type: Sequelize.UUID,
      },
      entity_type: {
        type: Sequelize.ENUM("user", "customer"),
        allowNull: false,
      },
      purpose_id: {
        type: Sequelize.UUID,
        references: {
          model: 'purposes', // Adjust table name if different
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      document_type_id: {
        type: Sequelize.UUID,
        references: {
          model: 'document_requirements', // Adjust table name if different
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      updated_by: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('documents');
  },
};
