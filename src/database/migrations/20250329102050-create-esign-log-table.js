'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create esign_log table
    await queryInterface.createTable('esign_log', {
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
      partner_order_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      attempt_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      task_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      group_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      esign_file_details: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      esign_stamp_details: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      esign_invitees: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      esign_details: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      esign_doc_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      request_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      esign_expiry: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      expired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      rejected: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      result: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      esigners: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      file_details: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      request_details: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      esign_irn: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      esign_folder: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      esign_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      esign_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      esigner_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      esigner_phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_signed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      type: {
        type: Sequelize.STRING,
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

    // Create the trigger function to log changes in the `esigns` table
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION log_esign_changes() RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          INSERT INTO esign_log (dml_action, log_timestamp, id, hashed_key, partner_order_id, order_id, attempt_number, task_id, group_id, esign_file_details, esign_stamp_details, esign_invitees, esign_details, esign_doc_id, status, request_id, completed_at, esign_expiry, active, expired, rejected, result, esigners, file_details, request_details, esign_irn, esign_folder, esign_type, esign_url, esigner_email, esigner_phone, is_signed, type, "createdAt", "updatedAt")
          VALUES ('I', NOW(), NEW.id, NEW.hashed_key, NEW.partner_order_id, NEW.order_id, NEW.attempt_number, NEW.task_id, NEW.group_id, NEW.esign_file_details, NEW.esign_stamp_details, NEW.esign_invitees, NEW.esign_details, NEW.esign_doc_id, NEW.status, NEW.request_id, NEW.completed_at, NEW.esign_expiry, NEW.active, NEW.expired, NEW.rejected, NEW.result, NEW.esigners, NEW.file_details, NEW.request_details, NEW.esign_irn, NEW.esign_folder, NEW.esign_type, NEW.esign_url, NEW.esigner_email, NEW.esigner_phone, NEW.is_signed, NEW.type, NEW."createdAt", NEW."updatedAt");
        ELSIF TG_OP = 'UPDATE' THEN
          INSERT INTO esign_log (dml_action, log_timestamp, id, hashed_key, partner_order_id, order_id, attempt_number, task_id, group_id, esign_file_details, esign_stamp_details, esign_invitees, esign_details, esign_doc_id, status, request_id, completed_at, esign_expiry, active, expired, rejected, result, esigners, file_details, request_details, esign_irn, esign_folder, esign_type, esign_url, esigner_email, esigner_phone, is_signed, type, "createdAt", "updatedAt")
          VALUES ('U', NOW(), NEW.id, NEW.hashed_key, NEW.partner_order_id, NEW.order_id, NEW.attempt_number, NEW.task_id, NEW.group_id, NEW.esign_file_details, NEW.esign_stamp_details, NEW.esign_invitees, NEW.esign_details, NEW.esign_doc_id, NEW.status, NEW.request_id, NEW.completed_at, NEW.esign_expiry, NEW.active, NEW.expired, NEW.rejected, NEW.result, NEW.esigners, NEW.file_details, NEW.request_details, NEW.esign_irn, NEW.esign_folder, NEW.esign_type, NEW.esign_url, NEW.esigner_email, NEW.esigner_phone, NEW.is_signed, NEW.type, NEW."createdAt", NEW."updatedAt");
        ELSIF TG_OP = 'DELETE' THEN
          INSERT INTO esign_log (dml_action, log_timestamp, id, hashed_key, partner_order_id, order_id, attempt_number, task_id, group_id, esign_file_details, esign_stamp_details, esign_invitees, esign_details, esign_doc_id, status, request_id, completed_at, esign_expiry, active, expired, rejected, result, esigners, file_details, request_details, esign_irn, esign_folder, esign_type, esign_url, esigner_email, esigner_phone, is_signed, type, "createdAt", "updatedAt")
          VALUES ('D', NOW(), OLD.id, OLD.hashed_key, OLD.partner_order_id, OLD.order_id, OLD.attempt_number, OLD.task_id, OLD.group_id, OLD.esign_file_details, OLD.esign_stamp_details, OLD.esign_invitees, OLD.esign_details, OLD.esign_doc_id, OLD.status, OLD.request_id, OLD.completed_at, OLD.esign_expiry, OLD.active, OLD.expired, OLD.rejected, OLD.result, OLD.esigners, OLD.file_details, OLD.request_details, OLD.esign_irn, OLD.esign_folder, OLD.esign_type, OLD.esign_url, OLD.esigner_email, OLD.esigner_phone, OLD.is_signed, OLD.type, OLD."createdAt", OLD."updatedAt");
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER esign_trigger
      AFTER INSERT OR UPDATE OR DELETE ON esigns
      FOR EACH ROW EXECUTE FUNCTION log_esign_changes();
    `);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('esign_log');
    await queryInterface.sequelize.query(
      'DROP TRIGGER IF EXISTS esign_trigger ON esigns',
    );
    await queryInterface.sequelize.query(
      'DROP FUNCTION IF EXISTS log_esign_changes',
    );
  },
};
