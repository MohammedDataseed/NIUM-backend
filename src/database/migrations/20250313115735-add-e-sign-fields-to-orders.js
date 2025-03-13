"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("orders", "e_sign_link_doc_id", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("orders", "e_sign_link_request_id", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("orders", "e_sign_link_doc_id");
    await queryInterface.removeColumn("orders", "e_sign_link_request_id");
  },
};
