"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("partner_products", {
      partner_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "my_partners", // Must match the actual table name, not the model name
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "products", // Must match the actual table name
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("partner_products");
  },
};
