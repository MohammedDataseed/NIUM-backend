"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("esigns");

    if (!tableInfo.result) {
      await queryInterface.addColumn("esigns", "result", {
        type: Sequelize.JSONB,
        allowNull: true,
      });
    }

    if (!tableInfo.esigners) {
      await queryInterface.addColumn("esigns", "esigners", {
        type: Sequelize.JSONB,
        allowNull: true,
      });
    }

    if (!tableInfo.file_details) {
      await queryInterface.addColumn("esigns", "file_details", {
        type: Sequelize.JSONB,
        allowNull: true,
      });
    }

    if (!tableInfo.request_details) {
      await queryInterface.addColumn("esigns", "request_details", {
        type: Sequelize.JSONB,
        allowNull: true,
      });
    }

    if (!tableInfo.esign_irn) {
      await queryInterface.addColumn("esigns", "esign_irn", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableInfo.esign_folder) {
      await queryInterface.addColumn("esigns", "esign_folder", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableInfo.esign_type) {
      await queryInterface.addColumn("esigns", "esign_type", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableInfo.esign_url) {
      await queryInterface.addColumn("esigns", "esign_url", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableInfo.esigner_email) {
      await queryInterface.addColumn("esigns", "esigner_email", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableInfo.esigner_phone) {
      await queryInterface.addColumn("esigns", "esigner_phone", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableInfo.type) {
      await queryInterface.addColumn("esigns", "type", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("esigns");

    if (tableInfo.result) {
      await queryInterface.removeColumn("esigns", "result");
    }

    if (tableInfo.esigners) {
      await queryInterface.removeColumn("esigns", "esigners");
    }

    if (tableInfo.file_details) {
      await queryInterface.removeColumn("esigns", "file_details");
    }

    if (tableInfo.request_details) {
      await queryInterface.removeColumn("esigns", "request_details");
    }

    if (tableInfo.esign_irn) {
      await queryInterface.removeColumn("esigns", "esign_irn");
    }

    if (tableInfo.esign_folder) {
      await queryInterface.removeColumn("esigns", "esign_folder");
    }

    if (tableInfo.esign_type) {
      await queryInterface.removeColumn("esigns", "esign_type");
    }

    if (tableInfo.esign_url) {
      await queryInterface.removeColumn("esigns", "esign_url");
    }

    if (tableInfo.esigner_email) {
      await queryInterface.removeColumn("esigns", "esigner_email");
    }

    if (tableInfo.esigner_phone) {
      await queryInterface.removeColumn("esigns", "esigner_phone");
    }

    if (tableInfo.type) {
      await queryInterface.removeColumn("esigns", "type");
    }
  },
};
