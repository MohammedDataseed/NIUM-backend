module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('order_log', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('order_log', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('order_log', 'createdAt');
    await queryInterface.removeColumn('order_log', 'updatedAt');
  },
};
