'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('role_log', {
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
        type: Sequelize.ENUM(
          'admin',
          'co-admin',
          'maker',
          'checker',
          'maker-checker',
        ),
        allowNull: false,
      },
      status: {
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

    // ✅ PostgreSQL Function & Trigger for Role Log
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION log_role_changes() RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          INSERT INTO role_log (dml_action, log_timestamp, id, hashed_key, name, status, created_by, updated_by, "createdAt", "updatedAt")
          VALUES ('I', NOW(), NEW.id, NEW.hashed_key, NEW.name::public.roles.name%TYPE, NEW.status, NEW.created_by, NEW.updated_by, NEW."createdAt", NEW."updatedAt");
        ELSIF TG_OP = 'UPDATE' THEN
          INSERT INTO role_log (dml_action, log_timestamp, id, hashed_key, name, status, created_by, updated_by, "createdAt", "updatedAt")
          VALUES ('U', NOW(), NEW.id, NEW.hashed_key, NEW.name::public.roles.name%TYPE, NEW.status, NEW.created_by, NEW.updated_by, NEW."createdAt", NEW."updatedAt");
        ELSIF TG_OP = 'DELETE' THEN
          INSERT INTO role_log (dml_action, log_timestamp, id, hashed_key, name, status, created_by, updated_by, "createdAt", "updatedAt")
          VALUES ('D', NOW(), OLD.id, OLD.hashed_key, OLD.name::public.roles.name%TYPE, OLD.status, OLD.created_by, OLD.updated_by, OLD."createdAt", OLD."updatedAt");
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER role_trigger
      AFTER INSERT OR UPDATE OR DELETE ON roles
      FOR EACH ROW EXECUTE FUNCTION log_role_changes();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `DROP TRIGGER IF EXISTS role_trigger ON roles`,
    );
    await queryInterface.sequelize.query(
      `DROP FUNCTION IF EXISTS log_role_changes`,
    );
    await queryInterface.dropTable('role_log');
  },
};
