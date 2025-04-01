'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purpose_logs', {
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
      purpose_name: {
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

    // Create triggers to log changes
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION log_purpose_changes() RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          INSERT INTO purpose_logs (dml_action, log_timestamp, id, hashed_key, purpose_name, is_active, created_at, updated_at, created_by, updated_by)
          VALUES ('I', NOW(), NEW.id, NEW.hashed_key, NEW.purpose_name, NEW.is_active, NEW.created_at, NEW.updated_at, NEW.created_by, NEW.updated_by);
        ELSIF TG_OP = 'UPDATE' THEN
          INSERT INTO purpose_logs (dml_action, log_timestamp, id, hashed_key, purpose_name, is_active, created_at, updated_at, created_by, updated_by)
          VALUES ('U', NOW(), NEW.id, NEW.hashed_key, NEW.purpose_name, NEW.is_active, NEW.created_at, NEW.updated_at, NEW.created_by, NEW.updated_by);
        ELSIF TG_OP = 'DELETE' THEN
          INSERT INTO purpose_logs (dml_action, log_timestamp, id, hashed_key, purpose_name, is_active, created_at, updated_at, created_by, updated_by)
          VALUES ('D', NOW(), OLD.id, OLD.hashed_key, OLD.purpose_name, OLD.is_active, OLD.created_at, OLD.updated_at, OLD.created_by, OLD.updated_by);
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER purpose_trigger
      AFTER INSERT OR UPDATE OR DELETE ON purposes
      FOR EACH ROW EXECUTE FUNCTION log_purpose_changes();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `DROP TRIGGER IF EXISTS purpose_trigger ON purposes`,
    );
    await queryInterface.sequelize.query(
      `DROP FUNCTION IF EXISTS log_purpose_changes`,
    );
    await queryInterface.dropTable('purpose_logs');
  },
};
