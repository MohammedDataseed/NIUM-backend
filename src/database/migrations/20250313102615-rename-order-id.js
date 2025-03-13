module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn("orders", "order_id", "partner_order_id");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn("orders", "partner_order_id", "order_id");
  },
};
