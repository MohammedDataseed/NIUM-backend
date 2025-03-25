'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Add the serial_number column (without auto-increment at first)
    await queryInterface.addColumn('orders', 'serial_number', {
      type: Sequelize.INTEGER,
      allowNull: true, // Temporarily allow NULL for data population
    });

    // Step 2: Create a sequence manually (if it doesn't exist) and attach it to the column
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE IF NOT EXISTS orders_serial_number_seq START WITH 1 INCREMENT BY 1;
      ALTER TABLE orders ALTER COLUMN serial_number SET DEFAULT nextval('orders_serial_number_seq');
    `);

    // Step 3: Populate serial_number for existing rows in sequence
    await queryInterface.sequelize.query(`
      WITH ordered AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS row_num
        FROM orders
      )
      UPDATE orders
      SET serial_number = ordered.row_num
      FROM ordered
      WHERE orders.id = ordered.id;
    `);

    // Step 4: Alter serial_number to NOT NULL
    await queryInterface.changeColumn('orders', 'serial_number', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: Sequelize.literal(`nextval('orders_serial_number_seq')`),
    });

    // Step 5: Ensure uniqueness by creating a unique index (instead of using 'unique' in column definition)
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS orders_serial_number_unique_idx ON orders(serial_number);
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'serial_number');
    await queryInterface.sequelize.query(`DROP SEQUENCE IF EXISTS orders_serial_number_seq;`);
  }
};
