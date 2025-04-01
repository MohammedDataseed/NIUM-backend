'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products_log', {
      log_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      dml_action: {
        type: Sequelize.ENUM('I', 'D', 'U'), // Insert, Delete, Update
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
      description: {
        type: Sequelize.TEXT,
      },
      is_active: {
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

    // PostgreSQL Trigger Function for Logging
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION log_product_changes() RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          INSERT INTO products_log (dml_action, log_timestamp, id, hashed_key, name, description, is_active, created_by, updated_by, "createdAt", "updatedAt")
          VALUES ('I', NOW(), NEW.id, NEW.hashed_key, NEW.name, NEW.description, NEW.is_active, NEW.created_by, NEW.updated_by, NEW."createdAt", NEW."updatedAt");
        ELSIF TG_OP = 'UPDATE' THEN
          INSERT INTO products_log (dml_action, log_timestamp, id, hashed_key, name, description, is_active, created_by, updated_by, "createdAt", "updatedAt")
          VALUES ('U', NOW(), NEW.id, NEW.hashed_key, NEW.name, NEW.description, NEW.is_active, NEW.created_by, NEW.updated_by, NEW."createdAt", NEW."updatedAt");
        ELSIF TG_OP = 'DELETE' THEN
          INSERT INTO products_log (dml_action, log_timestamp, id, hashed_key, name, description, is_active, created_by, updated_by, "createdAt", "updatedAt")
          VALUES ('D', NOW(), OLD.id, OLD.hashed_key, OLD.name, OLD.description, OLD.is_active, OLD.created_by, OLD.updated_by, OLD."createdAt", OLD."updatedAt");
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER product_trigger
      AFTER INSERT OR UPDATE OR DELETE ON products
      FOR EACH ROW EXECUTE FUNCTION log_product_changes();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `DROP TRIGGER IF EXISTS product_trigger ON products`,
    );
    await queryInterface.sequelize.query(
      `DROP FUNCTION IF EXISTS log_product_changes`,
    );
    await queryInterface.dropTable('products_log');
  },
};
