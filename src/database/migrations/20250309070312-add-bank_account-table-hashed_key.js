const { QueryInterface, DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface) {
    // Add hashed_key column after ifsc_code
    await queryInterface.addColumn("bank_accounts", "hashed_key", {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      after: "ifsc_code", // Ensures correct column order
    });
  },

  async down(queryInterface) {
    // Remove hashed_key column
    await queryInterface.removeColumn("bank_accounts", "hashed_key");
  },
};
