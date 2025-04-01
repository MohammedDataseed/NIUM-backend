'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bank_account_log', {
      log_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      dml_action: {
        type: Sequelize.ENUM('I', 'D', 'U'),
        allowNull: false,
      },
      log_timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      hashed_key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      account_holder_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      account_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bank_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bank_branch: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ifsc_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_beneficiary: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: false,
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

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION log_bank_account_changes() RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          INSERT INTO bank_account_log (dml_action, log_timestamp, id, hashed_key, account_holder_name, account_number, bank_name, bank_branch, ifsc_code, is_beneficiary, created_by, updated_by, "createdAt", "updatedAt")
          VALUES ('I', NOW(), NEW.id, NEW.hashed_key, NEW.account_holder_name, NEW.account_number, NEW.bank_name, NEW.bank_branch, NEW.ifsc_code, NEW.is_beneficiary, NEW.created_by, NEW.updated_by, NEW."createdAt", NEW."updatedAt");
        ELSIF TG_OP = 'UPDATE' THEN
          INSERT INTO bank_account_log (dml_action, log_timestamp, id, hashed_key, account_holder_name, account_number, bank_name, bank_branch, ifsc_code, is_beneficiary, created_by, updated_by, "createdAt", "updatedAt")
          VALUES ('U', NOW(), NEW.id, NEW.hashed_key, NEW.account_holder_name, NEW.account_number, NEW.bank_name, NEW.bank_branch, NEW.ifsc_code, NEW.is_beneficiary, NEW.created_by, NEW.updated_by, NEW."createdAt", NEW."updatedAt");
        ELSIF TG_OP = 'DELETE' THEN
          INSERT INTO bank_account_log (dml_action, log_timestamp, id, hashed_key, account_holder_name, account_number, bank_name, bank_branch, ifsc_code, is_beneficiary, created_by, updated_by, "createdAt", "updatedAt")
          VALUES ('D', NOW(), OLD.id, OLD.hashed_key, OLD.account_holder_name, OLD.account_number, OLD.bank_name, OLD.bank_branch, OLD.ifsc_code, OLD.is_beneficiary, OLD.created_by, OLD.updated_by, OLD."createdAt", OLD."updatedAt");
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER bank_account_trigger
      AFTER INSERT OR UPDATE OR DELETE ON bank_accounts
      FOR EACH ROW EXECUTE FUNCTION log_bank_account_changes();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `DROP TRIGGER IF EXISTS bank_account_trigger ON bank_accounts`,
    );
    await queryInterface.sequelize.query(
      `DROP FUNCTION IF EXISTS log_bank_account_changes`,
    );
    await queryInterface.dropTable('bank_account_log');
  },
};
