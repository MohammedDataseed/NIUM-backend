'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('partner_products_log', {
      log_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      dml_action: {
        type: Sequelize.ENUM('I', 'U', 'D'), // Insert, Update, Delete
        allowNull: false,
      },
      log_timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      partner_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Create Trigger Function for Logging
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION log_partner_products_changes() RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          INSERT INTO partner_products_log (dml_action, log_timestamp, partner_id, product_id, "createdAt", "updatedAt")
          VALUES ('I', NOW(), NEW.partner_id, NEW.product_id, NEW."createdAt", NEW."updatedAt");
        ELSIF TG_OP = 'UPDATE' THEN
          INSERT INTO partner_products_log (dml_action, log_timestamp, partner_id, product_id, "createdAt", "updatedAt")
          VALUES ('U', NOW(), NEW.partner_id, NEW.product_id, NEW."createdAt", NEW."updatedAt");
        ELSIF TG_OP = 'DELETE' THEN
          INSERT INTO partner_products_log (dml_action, log_timestamp, partner_id, product_id, "createdAt", "updatedAt")
          VALUES ('D', NOW(), OLD.partner_id, OLD.product_id, OLD."createdAt", OLD."updatedAt");
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      -- Create the Trigger
      CREATE TRIGGER partner_products_trigger
      AFTER INSERT OR UPDATE OR DELETE ON partner_products
      FOR EACH ROW EXECUTE FUNCTION log_partner_products_changes();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `DROP TRIGGER IF EXISTS partner_products_trigger ON partner_products`,
    );
    await queryInterface.sequelize.query(
      `DROP FUNCTION IF EXISTS log_partner_products_changes`,
    );
    await queryInterface.dropTable('partner_products_log');
  },
};
