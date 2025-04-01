'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('branch_log', {
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
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      business_type: {
        type: Sequelize.STRING,
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
      CREATE OR REPLACE FUNCTION log_branch_changes() RETURNS TRIGGER AS $$
        BEGIN
          IF TG_OP = 'INSERT' THEN
            INSERT INTO branch_log (dml_action, log_timestamp, id, hashed_key, name, location, city, state, business_type, created_by, updated_by, "createdAt", "updatedAt")
            VALUES ('I', NOW(), NEW.id, NEW.hashed_key, NEW.name, NEW.location, NEW.city, NEW.state, NEW.business_type, NEW.created_by, NEW.updated_by, NEW."createdAt", NEW."updatedAt");
          ELSIF TG_OP = 'UPDATE' THEN
            INSERT INTO branch_log (dml_action, log_timestamp, id, hashed_key, name, location, city, state, business_type, created_by, updated_by, "createdAt", "updatedAt")
            VALUES ('U', NOW(), NEW.id, NEW.hashed_key, NEW.name, NEW.location, NEW.city, NEW.state, NEW.business_type, NEW.created_by, NEW.updated_by, NEW."createdAt", NEW."updatedAt");
          ELSIF TG_OP = 'DELETE' THEN
            INSERT INTO branch_log (dml_action, log_timestamp, id, hashed_key, name, location, city, state, business_type, created_by, updated_by, "createdAt", "updatedAt")
            VALUES ('D', NOW(), OLD.id, OLD.hashed_key, OLD.name, OLD.location, OLD.city, OLD.state, OLD.business_type, OLD.created_by, OLD.updated_by, OLD."createdAt", OLD."updatedAt");
          END IF;
          RETURN NULL;
        END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER branch_trigger
      AFTER INSERT OR UPDATE OR DELETE ON branches
      FOR EACH ROW EXECUTE FUNCTION log_branch_changes();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `DROP TRIGGER IF EXISTS branch_trigger ON branches`,
    );
    await queryInterface.sequelize.query(
      `DROP FUNCTION IF EXISTS log_branch_changes`,
    );
    await queryInterface.dropTable('branch_log');
  },
};
