'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('document_requirements_log', {
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
      document_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_required: {
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

    // Create trigger function for logging changes
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION log_document_requirements_changes() RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          INSERT INTO document_requirements_log (dml_action, log_timestamp, id, hashed_key, document_type, is_required, created_by, updated_by, "createdAt", "updatedAt")
          VALUES ('I', NOW(), NEW.id, NEW.hashed_key, NEW.document_type, NEW.is_required, NEW.created_by, NEW.updated_by, NEW."createdAt", NEW."updatedAt");
        ELSIF TG_OP = 'UPDATE' THEN
          INSERT INTO document_requirements_log (dml_action, log_timestamp, id, hashed_key, document_type, is_required, created_by, updated_by, "createdAt", "updatedAt")
          VALUES ('U', NOW(), NEW.id, NEW.hashed_key, NEW.document_type, NEW.is_required, NEW.created_by, NEW.updated_by, NEW."createdAt", NEW."updatedAt");
        ELSIF TG_OP = 'DELETE' THEN
          INSERT INTO document_requirements_log (dml_action, log_timestamp, id, hashed_key, document_type, is_required, created_by, updated_by, "createdAt", "updatedAt")
          VALUES ('D', NOW(), OLD.id, OLD.hashed_key, OLD.document_type, OLD.is_required, OLD.created_by, OLD.updated_by, OLD."createdAt", OLD."updatedAt");
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER document_requirements_trigger
      AFTER INSERT OR UPDATE OR DELETE ON document_requirements
      FOR EACH ROW EXECUTE FUNCTION log_document_requirements_changes();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `DROP TRIGGER IF EXISTS document_requirements_trigger ON document_requirements`,
    );
    await queryInterface.sequelize.query(
      `DROP FUNCTION IF EXISTS log_document_requirements_changes`,
    );
    await queryInterface.dropTable('document_requirements_log');
  },
};
