'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create vkyc_log table
    await queryInterface.createTable('vkyc_log', {
      log_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      dml_action: {
        type: Sequelize.ENUM('I', 'U', 'D'),
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
      reference_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      profile_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      v_kyc_link: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      v_kyc_link_expires: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      v_kyc_link_status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      v_kyc_comments: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      v_kyc_doc_completion_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      device_info: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      profile_data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      performed_by: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      resources_documents: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      resources_documents_files: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      resources_images: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      resources_images_files: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      resources_videos: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      resources_videos_files: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      resources_text: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      location_info: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reviewer_action: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tasks: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status_description: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      status_detail: {
        type: Sequelize.STRING,
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
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Create the trigger function to log changes in the `vkyc` table
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION log_vkyc_changes() RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          INSERT INTO vkyc_log (dml_action, log_timestamp, id, hashed_key, partner_order_id, order_id, attempt_number, reference_id, profile_id, v_kyc_link, v_kyc_link_expires, v_kyc_link_status, v_kyc_comments, v_kyc_doc_completion_date, device_info, profile_data, performed_by, resources_documents, resources_documents_files, resources_images, resources_images_files, resources_videos, resources_videos_files, resources_text, location_info, first_name, reviewer_action, tasks, status, status_description, status_detail, created_by, updated_by, "createdAt", "updatedAt")
          VALUES ('I', NOW(), NEW.id, NEW.hashed_key, NEW.partner_order_id, NEW.order_id, NEW.attempt_number, NEW.reference_id, NEW.profile_id, NEW.v_kyc_link, NEW.v_kyc_link_expires, NEW.v_kyc_link_status, NEW.v_kyc_comments, NEW.v_kyc_doc_completion_date, NEW.device_info, NEW.profile_data, NEW.performed_by, NEW.resources_documents, NEW.resources_documents_files, NEW.resources_images, NEW.resources_images_files, NEW.resources_videos, NEW.resources_videos_files, NEW.resources_text, NEW.location_info, NEW.first_name, NEW.reviewer_action, NEW.tasks, NEW.status, NEW.status_description, NEW.status_detail, NEW.created_by, NEW.updated_by, NEW."createdAt", NEW."updatedAt");
        ELSIF TG_OP = 'UPDATE' THEN
          INSERT INTO vkyc_log (dml_action, log_timestamp, id, hashed_key, partner_order_id, order_id, attempt_number, reference_id, profile_id, v_kyc_link, v_kyc_link_expires, v_kyc_link_status, v_kyc_comments, v_kyc_doc_completion_date, device_info, profile_data, performed_by, resources_documents, resources_documents_files, resources_images, resources_images_files, resources_videos, resources_videos_files, resources_text, location_info, first_name, reviewer_action, tasks, status, status_description, status_detail, created_by, updated_by, "createdAt", "updatedAt")
          VALUES ('U', NOW(), NEW.id, NEW.hashed_key, NEW.partner_order_id, NEW.order_id, NEW.attempt_number, NEW.reference_id, NEW.profile_id, NEW.v_kyc_link, NEW.v_kyc_link_expires, NEW.v_kyc_link_status, NEW.v_kyc_comments, NEW.v_kyc_doc_completion_date, NEW.device_info, NEW.profile_data, NEW.performed_by, NEW.resources_documents, NEW.resources_documents_files, NEW.resources_images, NEW.resources_images_files, NEW.resources_videos, NEW.resources_videos_files, NEW.resources_text, NEW.location_info, NEW.first_name, NEW.reviewer_action, NEW.tasks, NEW.status, NEW.status_description, NEW.status_detail, NEW.created_by, NEW.updated_by, NEW."createdAt", NEW."updatedAt");
        ELSIF TG_OP = 'DELETE' THEN
          INSERT INTO vkyc_log (dml_action, log_timestamp, id, hashed_key, partner_order_id, order_id, attempt_number, reference_id, profile_id, v_kyc_link, v_kyc_link_expires, v_kyc_link_status, v_kyc_comments, v_kyc_doc_completion_date, device_info, profile_data, performed_by, resources_documents, resources_documents_files, resources_images, resources_images_files, resources_videos, resources_videos_files, resources_text, location_info, first_name, reviewer_action, tasks, status, status_description, status_detail, created_by, updated_by, "createdAt", "updatedAt")
          VALUES ('D', NOW(), OLD.id, OLD.hashed_key, OLD.partner_order_id, OLD.order_id, OLD.attempt_number, OLD.reference_id, OLD.profile_id, OLD.v_kyc_link, OLD.v_kyc_link_expires, OLD.v_kyc_link_status, OLD.v_kyc_comments, OLD.v_kyc_doc_completion_date, OLD.device_info, OLD.profile_data, OLD.performed_by, OLD.resources_documents, OLD.resources_documents_files, OLD.resources_images, OLD.resources_images_files, OLD.resources_videos, OLD.resources_videos_files, OLD.resources_text, OLD.location_info, OLD.first_name, OLD.reviewer_action, OLD.tasks, OLD.status, OLD.status_description, OLD.status_detail, OLD.created_by, OLD.updated_by, OLD."createdAt", OLD."updatedAt");
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER vkycs_trigger AFTER INSERT OR UPDATE OR DELETE ON vkycs FOR EACH ROW EXECUTE FUNCTION log_vkyc_changes();
    `);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('vkyc_log');
    await queryInterface.sequelize.query(
      'DROP TRIGGER IF EXISTS vkycs_trigger ON vkycs',
    );
    await queryInterface.sequelize.query(
      'DROP FUNCTION IF EXISTS log_vkycs_changes',
    );
  },
};
