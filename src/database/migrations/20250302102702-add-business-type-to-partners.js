module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('partners', 'business_type', {
      type: Sequelize.STRING,
      allowNull: true, // Adjust based on your requirement
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('partners', 'business_type');
  },
};
