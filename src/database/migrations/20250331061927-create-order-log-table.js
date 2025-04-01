'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_log', {
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
      serial_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      nium_order_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      hashed_key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      partner_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      partner_hashed_api_key: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      partner_hashed_key: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      partner_order_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      transaction_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      purpose_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_esign_required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      is_v_kyc_required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      customer_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customer_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customer_phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customer_pan: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      order_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      e_sign_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      e_sign_link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      e_sign_link_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      e_sign_link_doc_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      e_sign_link_request_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      e_sign_link_expires: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      e_sign_completed_by_customer: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      e_sign_customer_completion_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      e_sign_doc_comments: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      v_kyc_reference_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      v_kyc_profile_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      v_kyc_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      v_kyc_link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      v_kyc_link_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      v_kyc_link_expires: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      v_kyc_completed_by_customer: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      v_kyc_customer_completion_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      v_kyc_comments: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      incident_checker_comments: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nium_invoice_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      date_of_departure: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      incident_completion_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_esign_regenerated: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      is_esign_regenerated_details: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      is_video_kyc_link_regenerated: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      is_video_kyc_link_regenerated_details: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      incident_status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      checker_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      merged_document: {
        type: Sequelize.JSONB,
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
      CREATE OR REPLACE FUNCTION log_order_changes() RETURNS TRIGGER AS $$
        BEGIN
          IF TG_OP = 'INSERT' THEN
            INSERT INTO order_log (
              dml_action, log_timestamp, id, serial_number, nium_order_id, hashed_key, partner_id, 
              partner_hashed_api_key, partner_hashed_key, partner_order_id, transaction_type, purpose_type, 
              is_esign_required, is_v_kyc_required, customer_name, customer_email, customer_phone, customer_pan, 
              order_status, e_sign_status, e_sign_link, e_sign_link_status, e_sign_link_doc_id, e_sign_link_request_id, 
              e_sign_link_expires, e_sign_completed_by_customer, e_sign_customer_completion_date, e_sign_doc_comments, 
              v_kyc_reference_id, v_kyc_profile_id, v_kyc_status, v_kyc_link, v_kyc_link_status, v_kyc_link_expires, 
              v_kyc_completed_by_customer, v_kyc_customer_completion_date, v_kyc_comments, incident_checker_comments, 
              nium_invoice_number, date_of_departure, incident_completion_date, is_esign_regenerated, 
              is_esign_regenerated_details, is_video_kyc_link_regenerated, is_video_kyc_link_regenerated_details, 
              incident_status, created_by, updated_by, checker_id, merged_document, "createdAt", "updatedAt"
            ) 
            VALUES (
              'I', NOW(), NEW.id, NEW.serial_number, NEW.nium_order_id, NEW.hashed_key, NEW.partner_id, 
              NEW.partner_hashed_api_key, NEW.partner_hashed_key, NEW.partner_order_id, NEW.transaction_type, NEW.purpose_type, 
              NEW.is_esign_required, NEW.is_v_kyc_required, NEW.customer_name, NEW.customer_email, NEW.customer_phone, NEW.customer_pan, 
              NEW.order_status, NEW.e_sign_status, NEW.e_sign_link, NEW.e_sign_link_status, NEW.e_sign_link_doc_id, NEW.e_sign_link_request_id, 
              NEW.e_sign_link_expires, NEW.e_sign_completed_by_customer, NEW.e_sign_customer_completion_date, NEW.e_sign_doc_comments, 
              NEW.v_kyc_reference_id, NEW.v_kyc_profile_id, NEW.v_kyc_status, NEW.v_kyc_link, NEW.v_kyc_link_status, NEW.v_kyc_link_expires, 
              NEW.v_kyc_completed_by_customer, NEW.v_kyc_customer_completion_date, NEW.v_kyc_comments, NEW.incident_checker_comments, 
              NEW.nium_invoice_number, NEW.date_of_departure, NEW.incident_completion_date, NEW.is_esign_regenerated, 
              NEW.is_esign_regenerated_details, NEW.is_video_kyc_link_regenerated, NEW.is_video_kyc_link_regenerated_details, 
              NEW.incident_status, NEW.created_by, NEW.updated_by, NEW.checker_id, NEW.merged_document, NEW."createdAt", NEW."updatedAt"
            );
          ELSIF TG_OP = 'UPDATE' THEN
            INSERT INTO order_log (
              dml_action, log_timestamp, id, serial_number, nium_order_id, hashed_key, partner_id, 
              partner_hashed_api_key, partner_hashed_key, partner_order_id, transaction_type, purpose_type, 
              is_esign_required, is_v_kyc_required, customer_name, customer_email, customer_phone, customer_pan, 
              order_status, e_sign_status, e_sign_link, e_sign_link_status, e_sign_link_doc_id, e_sign_link_request_id, 
              e_sign_link_expires, e_sign_completed_by_customer, e_sign_customer_completion_date, e_sign_doc_comments, 
              v_kyc_reference_id, v_kyc_profile_id, v_kyc_status, v_kyc_link, v_kyc_link_status, v_kyc_link_expires, 
              v_kyc_completed_by_customer, v_kyc_customer_completion_date, v_kyc_comments, incident_checker_comments, 
              nium_invoice_number, date_of_departure, incident_completion_date, is_esign_regenerated, 
              is_esign_regenerated_details, is_video_kyc_link_regenerated, is_video_kyc_link_regenerated_details, 
              incident_status, created_by, updated_by, checker_id, merged_document, "createdAt", "updatedAt"
            ) 
            VALUES (
              'U', NOW(), NEW.id, NEW.serial_number, NEW.nium_order_id, NEW.hashed_key, NEW.partner_id, 
              NEW.partner_hashed_api_key, NEW.partner_hashed_key, NEW.partner_order_id, NEW.transaction_type, NEW.purpose_type, 
              NEW.is_esign_required, NEW.is_v_kyc_required, NEW.customer_name, NEW.customer_email, NEW.customer_phone, NEW.customer_pan, 
              NEW.order_status, NEW.e_sign_status, NEW.e_sign_link, NEW.e_sign_link_status, NEW.e_sign_link_doc_id, NEW.e_sign_link_request_id, 
              NEW.e_sign_link_expires, NEW.e_sign_completed_by_customer, NEW.e_sign_customer_completion_date, NEW.e_sign_doc_comments, 
              NEW.v_kyc_reference_id, NEW.v_kyc_profile_id, NEW.v_kyc_status, NEW.v_kyc_link, NEW.v_kyc_link_status, NEW.v_kyc_link_expires, 
              NEW.v_kyc_completed_by_customer, NEW.v_kyc_customer_completion_date, NEW.v_kyc_comments, NEW.incident_checker_comments, 
              NEW.nium_invoice_number, NEW.date_of_departure, NEW.incident_completion_date, NEW.is_esign_regenerated, 
              NEW.is_esign_regenerated_details, NEW.is_video_kyc_link_regenerated, NEW.is_video_kyc_link_regenerated_details, 
              NEW.incident_status, NEW.created_by, NEW.updated_by, NEW.checker_id, NEW.merged_document, NEW."createdAt", NEW."updatedAt"
            );
          ELSIF TG_OP = 'DELETE' THEN
            INSERT INTO order_log (
              dml_action, log_timestamp, id, serial_number, nium_order_id, hashed_key, partner_id, 
              partner_hashed_api_key, partner_hashed_key, partner_order_id, transaction_type, purpose_type, 
              is_esign_required, is_v_kyc_required, customer_name, customer_email, customer_phone, customer_pan, 
              order_status, e_sign_status, e_sign_link, e_sign_link_status, e_sign_link_doc_id, e_sign_link_request_id, 
              e_sign_link_expires, e_sign_completed_by_customer, e_sign_customer_completion_date, e_sign_doc_comments, 
              v_kyc_reference_id, v_kyc_profile_id, v_kyc_status, v_kyc_link, v_kyc_link_status, v_kyc_link_expires, 
              v_kyc_completed_by_customer, v_kyc_customer_completion_date, v_kyc_comments, incident_checker_comments, 
              nium_invoice_number, date_of_departure, incident_completion_date, is_esign_regenerated, 
              is_esign_regenerated_details, is_video_kyc_link_regenerated, is_video_kyc_link_regenerated_details, 
              incident_status, created_by, updated_by, checker_id, merged_document, "createdAt", "updatedAt"
            ) 
            VALUES (
              'D', NOW(), OLD.id, OLD.serial_number, OLD.nium_order_id, OLD.hashed_key, OLD.partner_id, 
              OLD.partner_hashed_api_key, OLD.partner_hashed_key, OLD.partner_order_id, OLD.transaction_type, OLD.purpose_type, 
              OLD.is_esign_required, OLD.is_v_kyc_required, OLD.customer_name, OLD.customer_email, OLD.customer_phone, OLD.customer_pan, 
              OLD.order_status, OLD.e_sign_status, OLD.e_sign_link, OLD.e_sign_link_status, OLD.e_sign_link_doc_id, OLD.e_sign_link_request_id, 
              OLD.e_sign_link_expires, OLD.e_sign_completed_by_customer, OLD.e_sign_customer_completion_date, OLD.e_sign_doc_comments, 
              OLD.v_kyc_reference_id, OLD.v_kyc_profile_id, OLD.v_kyc_status, OLD.v_kyc_link, OLD.v_kyc_link_status, OLD.v_kyc_link_expires, 
              OLD.v_kyc_completed_by_customer, OLD.v_kyc_customer_completion_date, OLD.v_kyc_comments, OLD.incident_checker_comments, 
              OLD.nium_invoice_number, OLD.date_of_departure, OLD.incident_completion_date, OLD.is_esign_regenerated, 
              OLD.is_esign_regenerated_details, OLD.is_video_kyc_link_regenerated, OLD.is_video_kyc_link_regenerated_details, 
              OLD.incident_status, OLD.created_by, OLD.updated_by, OLD.checker_id, OLD.merged_document, OLD."createdAt", OLD."updatedAt"
            );
          END IF;
          RETURN NULL;
        END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER order_trigger
      AFTER INSERT OR UPDATE OR DELETE ON orders
      FOR EACH ROW EXECUTE FUNCTION log_order_changes();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `DROP TRIGGER IF EXISTS order_trigger ON orders`,
    );
    await queryInterface.sequelize.query(
      `DROP FUNCTION IF EXISTS log_order_changes`,
    );
    await queryInterface.dropTable('order_logs');
  },
};
