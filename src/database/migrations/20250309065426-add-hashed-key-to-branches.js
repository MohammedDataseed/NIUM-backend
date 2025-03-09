const { QueryInterface, DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface) {
    // 1. Add column without NOT NULL constraint
    await queryInterface.addColumn("branches", "hashed_key", {
      type: DataTypes.STRING,
      allowNull: true, // Temporarily allow nulls
      unique: true,
    });

    // 2. Set default hashed_key values for existing rows
    await queryInterface.sequelize.query(`
      UPDATE branches 
      SET hashed_key = md5(random()::text) 
      WHERE hashed_key IS NULL;
    `);

    // 3. Alter column to make it NOT NULL
    await queryInterface.changeColumn("branches", "hashed_key", {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("branches", "hashed_key");
  },
};
