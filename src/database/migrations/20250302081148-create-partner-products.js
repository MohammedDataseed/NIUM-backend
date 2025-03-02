"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("partner_products", {
      partner_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "partners", // ✅ Make sure this matches the actual table name
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "products", // ✅ Ensure this matches your `products` table
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
