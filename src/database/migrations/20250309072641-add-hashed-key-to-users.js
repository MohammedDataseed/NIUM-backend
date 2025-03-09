module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableName = "users";

    // Step 1: Add hashed_key column as nullable first
    await queryInterface.addColumn(tableName, "hashed_key", {
      type: Sequelize.STRING,
      allowNull: true, // Initially nullable
      unique: true,
    });

    // Step 2: Populate existing users with a hashed_key
    const [users] = await queryInterface.sequelize.query(`SELECT id, email FROM ${tableName}`);

    for (const user of users) {
      const hashedKey = require("crypto")
        .createHash("sha256")
        .update(`${user.email}-${Date.now()}`)
        .digest("hex");

      await queryInterface.sequelize.query(
        `UPDATE ${tableName} SET hashed_key = '${hashedKey}' WHERE id = '${user.id}'`
      );
    }

    // Step 3: Make hashed_key column NOT NULL
    await queryInterface.changeColumn(tableName, "hashed_key", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "hashed_key");
  },
};
