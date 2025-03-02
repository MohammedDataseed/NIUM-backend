module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("partners", "first_name", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("partners", "last_name", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("partners", "first_name");
    await queryInterface.removeColumn("partners", "last_name");
  },
};
