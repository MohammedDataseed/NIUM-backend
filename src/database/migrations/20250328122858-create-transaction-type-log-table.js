'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaction_type_log', {
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
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
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
    });

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION log_transaction_type_changes() RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          INSERT INTO transaction_type_log (dml_action, log_timestamp, id, hashed_key, name, is_active, created_at, updated_at, created_by, updated_by)
          VALUES ('I', NOW(), NEW.id, NEW.hashed_key, NEW.name, NEW.is_active, NEW.created_at, NEW.updated_at, NEW.created_by, NEW.updated_by);
        ELSIF TG_OP = 'UPDATE' THEN
          INSERT INTO transaction_type_log (dml_action, log_timestamp, id, hashed_key, name, is_active, created_at, updated_at, created_by, updated_by)
          VALUES ('U', NOW(), NEW.id, NEW.hashed_key, NEW.name, NEW.is_active, NEW.created_at, NEW.updated_at, NEW.created_by, NEW.updated_by);
        ELSIF TG_OP = 'DELETE' THEN
          INSERT INTO transaction_type_log (dml_action, log_timestamp, id, hashed_key, name, is_active, created_at, updated_at, created_by, updated_by)
          VALUES ('D', NOW(), OLD.id, OLD.hashed_key, OLD.name, OLD.is_active, OLD.created_at, OLD.updated_at, OLD.created_by, OLD.updated_by);
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER transaction_type_trigger
      AFTER INSERT OR UPDATE OR DELETE ON transaction_type
      FOR EACH ROW EXECUTE FUNCTION log_transaction_type_changes();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `DROP TRIGGER IF EXISTS transaction_type_trigger ON transaction_type`,
    );
    await queryInterface.sequelize.query(
      `DROP FUNCTION IF EXISTS log_transaction_type_changes`,
    );
    await queryInterface.dropTable('transaction_type_log');
  },
};
