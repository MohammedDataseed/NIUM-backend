module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('role_log', {
      log_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id: {  // 🔹 Add missing id column
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'roles', key: 'id' }, // Foreign key to Role
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      hashed_key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.ENUM('admin', 'co-admin', 'maker', 'checker', 'maker-checker'),
        allowNull: false,
      },
      dml_action: {
        type: Sequelize.STRING(1),
        allowNull: false,
      },
      log_timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('role_log');
  }
};
