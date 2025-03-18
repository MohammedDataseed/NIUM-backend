"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("esigns");

    if (!tableInfo.is_signed) {
      await queryInterface.addColumn("esigns", "is_signed", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("esigns");

    if (tableInfo.is_signed) {
      await queryInterface.removeColumn("esigns", "is_signed");
    }
  },
};
