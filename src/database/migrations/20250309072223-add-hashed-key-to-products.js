module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableName = "products";

    // Step 1: Add the column as nullable
    await queryInterface.addColumn(tableName, "hashed_key", {
      type: Sequelize.STRING,
      allowNull: true, // Initially, make it nullable
      unique: true,
    });

    // Step 2: Populate existing rows with a unique hashed_key
    const [products] = await queryInterface.sequelize.query(`SELECT id, name FROM ${tableName}`);

    for (const product of products) {
      const hashedKey = require("crypto")
        .createHash("sha256")
        .update(`${product.name}-${Date.now()}`)
        .digest("hex");

      await queryInterface.sequelize.query(
        `UPDATE ${tableName} SET hashed_key = '${hashedKey}' WHERE id = '${product.id}'`
      );
    }

    // Step 3: Change the column to NOT NULL
    await queryInterface.changeColumn(tableName, "hashed_key", {
      type: Sequelize.STRING,
      allowNull: false, // Now make it NOT NULL
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("products", "hashed_key");
  },
};
