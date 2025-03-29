module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Create a new ENUM type with the correct values
    await queryInterface.sequelize.query(`
      CREATE TYPE "new_business_type_enum" AS ENUM ('cash&carry', 'large_enterprise');
    `);

    // Step 2: Change the column type in the 'branches' table
    await queryInterface.sequelize.query(`
      ALTER TABLE branches 
      ALTER COLUMN business_type TYPE "new_business_type_enum" 
      USING business_type::text::"new_business_type_enum";
    `);

    // Step 3: Change the column type in the 'branch_log' table
    await queryInterface.sequelize.query(`
      ALTER TABLE branch_log 
      ALTER COLUMN business_type TYPE "new_business_type_enum" 
      USING business_type::text::"new_business_type_enum";
    `);

    // Step 4: Drop the old ENUM type (if it exists)
    await queryInterface.sequelize.query(`
      DROP TYPE "enum_branches_business_type";
    `);

    // Step 5: Rename the new ENUM type to match the old name
    await queryInterface.sequelize.query(`
      ALTER TYPE "new_business_type_enum" RENAME TO "enum_branches_business_type";
    `);
  },

  async down(queryInterface, Sequelize) {
    // Step 1: Create the old ENUM type again (if rolling back)
    await queryInterface.sequelize.query(`
      CREATE TYPE "old_business_type_enum" AS ENUM ('cash&carry');
    `);

    // Step 2: Revert the column type in the 'branches' table
    await queryInterface.sequelize.query(`
      ALTER TABLE branches 
      ALTER COLUMN business_type TYPE "old_business_type_enum" 
      USING business_type::text::"old_business_type_enum";
    `);

    // Step 3: Revert the column type in the 'branch_log' table
    await queryInterface.sequelize.query(`
      ALTER TABLE branch_log 
      ALTER COLUMN business_type TYPE "old_business_type_enum" 
      USING business_type::text::"old_business_type_enum";
    `);

    // Step 4: Drop the new ENUM type and rename back to old
    await queryInterface.sequelize.query(`
      DROP TYPE "enum_branches_business_type";
    `);
    
    await queryInterface.sequelize.query(`
      ALTER TYPE "old_business_type_enum" RENAME TO "enum_branches_business_type";
    `);
  },
};
