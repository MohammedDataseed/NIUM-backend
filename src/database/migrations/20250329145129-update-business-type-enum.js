module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('branches', 'business_type', {
      type: Sequelize.ENUM('cash&carry', 'large_enterprise'),
      allowNull: false,
    });

    await queryInterface.changeColumn('branch_log', 'business_type', {
      type: Sequelize.ENUM('cash&carry', 'large_enterprise'),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('branches', 'business_type', {
      type: Sequelize.ENUM('cash&carry'),
      allowNull: false,
    });

    await queryInterface.changeColumn('branch_log', 'business_type', {
      type: Sequelize.ENUM('cash&carry'),
      allowNull: false,
    });
  },
};
