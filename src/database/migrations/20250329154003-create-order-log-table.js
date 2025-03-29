"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create order_log table
    await queryInterface.createTable("order_log", {
      log_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dml_action: {
        type: Sequelize.ENUM("I", "D", "U"),
        allowNull: false, // "I" - Insert, "U" - Update, "D" - Delete
      },
      log_timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      serial_number: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      nium_order_id: {
        type: Sequelize.STRING,
      },
      hashed_key: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "",
      },
      partner_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      partner_hashed_api_key: {
        type: Sequelize.STRING,
      },
      partner_hashed_key: {
        type: Sequelize.STRING,
      },
      partner_order_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      transaction_type: {
        type: Sequelize.STRING,
      },
      purpose_type: {
        type: Sequelize.STRING,
      },
      is_esign_required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_v_kyc_required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      },
      e_sign_status: {
        type: Sequelize.STRING,
      },
      e_sign_link: {
        type: Sequelize.STRING,
      },
      e_sign_link_status: {
        type: Sequelize.STRING,
      },
      e_sign_link_doc_id: {
        type: Sequelize.STRING,
      },
      e_sign_link_request_id: {
        type: Sequelize.STRING,
      },
      e_sign_link_expires: {
        type: Sequelize.DATE,
      },
      e_sign_completed_by_customer: {
        type: Sequelize.BOOLEAN,
      },
      e_sign_customer_completion_date: {
        type: Sequelize.DATE,
      },
      e_sign_doc_comments: {
        type: Sequelize.STRING,
      },
      v_kyc_reference_id: {
        type: Sequelize.STRING,
      },
      v_kyc_profile_id: {
        type: Sequelize.STRING,
      },
      v_kyc_status: {
        type: Sequelize.STRING,
      },
      v_kyc_link: {
        type: Sequelize.STRING,
      },
      v_kyc_link_status: {
        type: Sequelize.STRING,
      },
      v_kyc_link_expires: {
        type: Sequelize.DATE,
      },
      v_kyc_completed_by_customer: {
        type: Sequelize.BOOLEAN,
      },
      v_kyc_customer_completion_date: {
        type: Sequelize.DATE,
      },
      v_kyc_comments: {
        type: Sequelize.STRING,
      },
      incident_status: {
        type: Sequelize.BOOLEAN,
      },
      incident_checker_comments: {
        type: Sequelize.STRING,
      },
      nium_invoice_number: {
        type: Sequelize.STRING,
      },
      date_of_departure: {
        type: Sequelize.DATE,
      },
      incident_completion_date: {
        type: Sequelize.DATE,
      },
      is_esign_regenerated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_esign_regenerated_details: {
        type: Sequelize.JSONB,
      },
      is_video_kyc_link_regenerated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_video_kyc_link_regenerated_details: {
        type: Sequelize.JSONB,
      },
      created_by: {
        type: Sequelize.UUID,
      },
      updated_by: {
        type: Sequelize.UUID,
      },
      checker_id: {
        type: Sequelize.UUID,
      },
      merged_document: {
        type: Sequelize.JSONB,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Create PostgreSQL function for logging changes
    await queryInterface.sequelize.query(`
     CREATE OR REPLACE FUNCTION log_orders_changes() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO order_log (
      dml_action, log_timestamp, id, serial_number, nium_order_id, hashed_key, partner_id,
      partner_hashed_api_key, partner_hashed_key, partner_order_id, transaction_type, purpose_type,
      is_esign_required, is_v_kyc_required, customer_name, customer_email, customer_phone, customer_pan,
      order_status, e_sign_status, e_sign_link, e_sign_link_status, e_sign_link_doc_id, e_sign_link_request_id,
      e_sign_link_expires, e_sign_completed_by_customer, e_sign_customer_completion_date, e_sign_doc_comments,
      v_kyc_reference_id, v_kyc_profile_id, v_kyc_status, v_kyc_link, v_kyc_link_status, v_kyc_link_expires,
      v_kyc_completed_by_customer, v_kyc_customer_completion_date, v_kyc_comments, incident_status,
      incident_checker_comments, nium_invoice_number, date_of_departure, incident_completion_date,
      is_esign_regenerated, is_esign_regenerated_details, is_video_kyc_link_regenerated,
      is_video_kyc_link_regenerated_details, created_by, updated_by, checker_id, merged_document,
      created_at, updated_at
    )
    VALUES (
      'I', NOW(), NEW.id, NEW.serial_number, NEW.nium_order_id, NEW.hashed_key, NEW.partner_id,
      NEW.partner_hashed_api_key, NEW.partner_hashed_key, NEW.partner_order_id, NEW.transaction_type, NEW.purpose_type,
      NEW.is_esign_required, NEW.is_v_kyc_required, NEW.customer_name, NEW.customer_email, NEW.customer_phone, NEW.customer_pan,
      NEW.order_status, NEW.e_sign_status, NEW.e_sign_link, NEW.e_sign_link_status, NEW.e_sign_link_doc_id, NEW.e_sign_link_request_id,
      NEW.e_sign_link_expires, NEW.e_sign_completed_by_customer, NEW.e_sign_customer_completion_date, NEW.e_sign_doc_comments,
      NEW.v_kyc_reference_id, NEW.v_kyc_profile_id, NEW.v_kyc_status, NEW.v_kyc_link, NEW.v_kyc_link_status, NEW.v_kyc_link_expires,
      NEW.v_kyc_completed_by_customer, NEW.v_kyc_customer_completion_date, NEW.v_kyc_comments, NEW.incident_status,
      NEW.incident_checker_comments, NEW.nium_invoice_number, NEW.date_of_departure, NEW.incident_completion_date,
      NEW.is_esign_regenerated, NEW.is_esign_regenerated_details, NEW.is_video_kyc_link_regenerated,
      NEW.is_video_kyc_link_regenerated_details, NEW.created_by, NEW.updated_by, NEW.checker_id, NEW.merged_document,
      NEW.created_at, NEW.updated_at
    );
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO order_log (
      dml_action, log_timestamp, id, serial_number, nium_order_id, hashed_key, partner_id,
      partner_hashed_api_key, partner_hashed_key, partner_order_id, transaction_type, purpose_type,
      is_esign_required, is_v_kyc_required, customer_name, customer_email, customer_phone, customer_pan,
      order_status, e_sign_status, e_sign_link, e_sign_link_status, e_sign_link_doc_id, e_sign_link_request_id,
      e_sign_link_expires, e_sign_completed_by_customer, e_sign_customer_completion_date, e_sign_doc_comments,
      v_kyc_reference_id, v_kyc_profile_id, v_kyc_status, v_kyc_link, v_kyc_link_status, v_kyc_link_expires,
      v_kyc_completed_by_customer, v_kyc_customer_completion_date, v_kyc_comments, incident_status,
      incident_checker_comments, nium_invoice_number, date_of_departure, incident_completion_date,
      is_esign_regenerated, is_esign_regenerated_details, is_video_kyc_link_regenerated,
      is_video_kyc_link_regenerated_details, created_by, updated_by, checker_id, merged_document,
      created_at, updated_at
    )
    VALUES (
      'U', NOW(), NEW.id, NEW.serial_number, NEW.nium_order_id, NEW.hashed_key, NEW.partner_id,
      NEW.partner_hashed_api_key, NEW.partner_hashed_key, NEW.partner_order_id, NEW.transaction_type, NEW.purpose_type,
      NEW.is_esign_required, NEW.is_v_kyc_required, NEW.customer_name, NEW.customer_email, NEW.customer_phone, NEW.customer_pan,
      NEW.order_status, NEW.e_sign_status, NEW.e_sign_link, NEW.e_sign_link_status, NEW.e_sign_link_doc_id, NEW.e_sign_link_request_id,
      NEW.e_sign_link_expires, NEW.e_sign_completed_by_customer, NEW.e_sign_customer_completion_date, NEW.e_sign_doc_comments,
      NEW.v_kyc_reference_id, NEW.v_kyc_profile_id, NEW.v_kyc_status, NEW.v_kyc_link, NEW.v_kyc_link_status, NEW.v_kyc_link_expires,
      NEW.v_kyc_completed_by_customer, NEW.v_kyc_customer_completion_date, NEW.v_kyc_comments, NEW.incident_status,
      NEW.incident_checker_comments, NEW.nium_invoice_number, NEW.date_of_departure, NEW.incident_completion_date,
      NEW.is_esign_regenerated, NEW.is_esign_regenerated_details, NEW.is_video_kyc_link_regenerated,
      NEW.is_video_kyc_link_regenerated_details, NEW.created_by, NEW.updated_by, NEW.checker_id, NEW.merged_document,
      NEW.created_at, NEW.updated_at
    );
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO order_log (dml_action, log_timestamp, id) 
    VALUES ('D', NOW(), OLD.id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `DROP TRIGGER IF EXISTS orders_logging_trigger ON orders`
    );
    await queryInterface.sequelize.query(
      `DROP FUNCTION IF EXISTS log_orders_changes`
    );
    await queryInterface.dropTable("order_log");
  },
};
