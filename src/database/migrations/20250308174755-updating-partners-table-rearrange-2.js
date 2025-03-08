'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Get a valid user ID from the users table (e.g., the first id)
    const [validUserResult] = await queryInterface.sequelize.query(
      `SELECT id FROM users LIMIT 1`
    );
    const defaultUserId = validUserResult[0]?.id || '00000000-0000-0000-0000-000000000000'; // Fallback to dummy if no users

    // Create a temporary table with the desired column order
    await queryInterface.createTable('partners_temp', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      api_key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      // Place these columns last in the desired order
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      business_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hashed_key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
    });

    // Step 2: Copy data from the old table to the new one with valid user IDs
    await queryInterface.sequelize.query(`
      INSERT INTO partners_temp (
        id, role_id, email, password, api_key, is_active, created_at, updated_at, 
        created_by, updated_by, first_name, last_name, business_type, hashed_key
      )
      SELECT 
        id, role_id, email, password, api_key, is_active, created_at, updated_at, 
        COALESCE(created_by, '${defaultUserId}') AS created_by,
        COALESCE(updated_by, '${defaultUserId}') AS updated_by,
        first_name, last_name, business_type, 
        COALESCE(hashed_key, encode(sha256((id::text || NOW()::text)::bytea), 'hex')) AS hashed_key
      FROM partners;
    `);

    // Step 3: Drop the old table
    await queryInterface.dropTable('partners');

    // Step 4: Rename the temporary table to the original name
    await queryInterface.renameTable('partners_temp', 'partners');
  },

  async down(queryInterface, Sequelize) {
    // Recreate the old table structure for rollback
    await queryInterface.createTable('partners_temp', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      api_key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      business_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hashed_key: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      branch_id: { // Add back legacy columns for rollback
        type: Sequelize.STRING,
        allowNull: true,
      },
      
      bank_account: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      
    });

    // Copy data back
    await queryInterface.sequelize.query(`
      INSERT INTO partners_temp (
        id, role_id, email, password, branch_id, api_key, bank_acc, is_active, 
        created_at, updated_at, created_by, updated_by, first_name, last_name, 
        business_type, hashed_key
      )
      SELECT 
        id, role_id, email, password, NULL AS branch_id, api_key, NULL AS bank_acc, 
        is_active, created_at, updated_at, created_by, updated_by, first_name, 
        last_name, business_type, hashed_key
      FROM partners;
    `);

    await queryInterface.dropTable('partners');
    await queryInterface.renameTable('partners_temp', 'partners');
  }
};