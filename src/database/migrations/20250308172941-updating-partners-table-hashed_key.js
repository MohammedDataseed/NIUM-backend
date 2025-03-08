'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Add the hashed_key column without NOT NULL constraint initially
    await queryInterface.addColumn('partners', 'hashed_key', {
      type: Sequelize.STRING,
      unique: true, // UNIQUE constraint can be applied immediately
    });

    // Step 2: Populate hashed_key for existing rows
    await queryInterface.sequelize.query(`
      UPDATE partners 
      SET hashed_key = encode(sha256((id::text || NOW()::text)::bytea), 'hex')
      WHERE hashed_key IS NULL;
    `);

    // Step 3: Add the NOT NULL constraint after populating the column
    await queryInterface.changeColumn('partners', 'hashed_key', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the hashed_key column
    await queryInterface.removeColumn('partners', 'hashed_key');
  }
};