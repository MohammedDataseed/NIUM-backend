'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users_log', {
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
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hashed_key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      branch_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      bank_account_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      business_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
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
      CREATE OR REPLACE FUNCTION log_user_changes() RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
            INSERT INTO users_log (
                dml_action, log_timestamp, id, email, password, hashed_key, role_id, branch_id, bank_account_id, is_active, business_type, created_by, updated_by, "createdAt", "updatedAt"
            ) VALUES (
                'I', NOW(), NEW.id, NEW.email, NEW.password, NEW.hashed_key, NEW.role_id, NEW.branch_id, NEW.bank_account_id, NEW.is_active, NEW.business_type, NEW.created_by, NEW.updated_by, NEW."createdAt", NEW."updatedAt"
            );
        
        ELSIF TG_OP = 'UPDATE' THEN
            INSERT INTO users_log (
                dml_action, log_timestamp, id, email, password, hashed_key, role_id, branch_id, bank_account_id, is_active, business_type, created_by, updated_by, "createdAt", "updatedAt"
            ) VALUES (
                'U', NOW(), NEW.id, NEW.email, NEW.password, NEW.hashed_key, NEW.role_id, NEW.branch_id, NEW.bank_account_id, NEW.is_active, NEW.business_type, NEW.created_by, NEW.updated_by, NEW."createdAt", NEW."updatedAt"
            );
        
        ELSIF TG_OP = 'DELETE' THEN
            INSERT INTO users_log (
                dml_action, log_timestamp, id, email, password, hashed_key, role_id, branch_id, bank_account_id, is_active, business_type, created_by, updated_by, "createdAt", "updatedAt"
            ) VALUES (
                'D', NOW(), OLD.id, OLD.password, OLD.hashed_key, OLD.role_id, OLD.branch_id, OLD.bank_account_id, OLD.is_active, OLD.business_type, OLD.created_by, OLD.updated_by, OLD."createdAt", OLD."updatedAt"
            );
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER user_trigger
      AFTER INSERT OR UPDATE OR DELETE ON users
      FOR EACH ROW EXECUTE FUNCTION log_user_changes();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `DROP TRIGGER IF EXISTS user_trigger ON users`,
    );
    await queryInterface.sequelize.query(
      `DROP FUNCTION IF EXISTS log_user_changes`,
    );
    await queryInterface.dropTable('users_log');
  },
};
