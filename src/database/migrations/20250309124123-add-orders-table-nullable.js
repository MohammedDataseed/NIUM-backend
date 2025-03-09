// migrations/20250309-make-order-columns-nullable.js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('orders', 'transaction_type', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('orders', 'purpose_type', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('orders', 'created_by', {
      type: Sequelize.DataTypes.UUID,
      allowNull: true,
    });
    await queryInterface.changeColumn('orders', 'updated_by', {
      type: Sequelize.DataTypes.UUID,
      allowNull: true,
    });
    await queryInterface.changeColumn('orders', 'checker_id', {
      type: Sequelize.DataTypes.UUID,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('orders', 'transaction_type', {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('orders', 'purpose_type', {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('orders', 'created_by', {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
    });
    await queryInterface.changeColumn('orders', 'updated_by', {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
    });
    await queryInterface.changeColumn('orders', 'checker_id', {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
    });
  },
};