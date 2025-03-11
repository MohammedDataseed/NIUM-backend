module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('esigns', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    });

    await queryInterface.addColumn('esigns', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('esigns', 'createdAt');
    await queryInterface.removeColumn('esigns', 'updatedAt');
  },
};