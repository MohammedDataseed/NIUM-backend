//vkyc.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Unique,
  BeforeValidate,
  AllowNull,
  BeforeCreate,
  AfterCreate,
  AfterUpdate,
  AfterDestroy,
} from 'sequelize-typescript';
import { Order } from './order.model';
import { VkycLog } from './vkyc_log.model';
import * as crypto from 'crypto';

@Table({
  tableName: 'vkycs',
  timestamps: true,
})
export class Vkyc extends Model<Vkyc> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;
  @Unique
  @AllowNull(true)
  @Column({ type: DataType.STRING, field: 'hashed_key' })
  hashed_key: string;

  @Column({ type: DataType.STRING, allowNull: false })
  partner_order_id: string; // 🔥 This is just for storing user input

  @ForeignKey(() => Order)
  @Column({ type: DataType.UUID, allowNull: false })
  order_id: string; // 🔥 This will store the actual primary key of Order

  @BelongsTo(() => Order, { foreignKey: 'order_id', targetKey: 'id' })
  order: Order;

  @Column({ type: DataType.INTEGER, allowNull: false })
  attempt_number: number;

  // New fields from the first API response

  @Column({ type: DataType.STRING, allowNull: true })
  reference_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  profile_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  v_kyc_link: string;

  @Column({ type: DataType.DATE, allowNull: false })
  v_kyc_link_expires: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  v_kyc_link_status: string;

  @Column({ type: DataType.STRING, allowNull: true })
  v_kyc_comments: string;

  @Column({ type: DataType.DATE, allowNull: true })
  v_kyc_doc_completion_date: Date;

  // New fields from the second API response

  @Column({ type: DataType.JSONB, allowNull: true })
  device_info: any; // stores device info like IP and User Agent

  @Column({ type: DataType.JSONB, allowNull: true })
  profile_data: any; // stores profile details like email, mobile, and notes

  @Column({ type: DataType.JSONB, allowNull: true })
  performed_by: any[]; // stores actions performed by various accounts

  // @Column({ type: DataType.JSONB, allowNull: true })
  // resources_documents: any[];  // stores the document resources

  // @Column({ type: DataType.JSONB, allowNull: true })
  // resources_images: any[];  // stores the image resources

  // @Column({ type: DataType.JSONB, allowNull: true })
  // resources_videos: any[];  // stores video resources

  @Column({ type: DataType.JSONB, allowNull: true })
  resources_documents: any[]; // Stores document metadata

  @Column({ type: DataType.JSONB, allowNull: true })
  resources_documents_files: any[]; // Stores document file URLs

  @Column({ type: DataType.JSONB, allowNull: true })
  resources_images: any[]; // Stores image metadata

  @Column({ type: DataType.JSONB, allowNull: true })
  resources_images_files: any[]; // Stores image file URLs

  @Column({ type: DataType.JSONB, allowNull: true })
  resources_videos: any[]; // Stores video metadata

  @Column({ type: DataType.JSONB, allowNull: true })
  resources_videos_files: any[]; // Stores video file URLs

  @Column({ type: DataType.JSONB, allowNull: true })
  resources_text: any[]; // Stores text resources (location, name, DOB)

  @Column({ type: DataType.JSONB, allowNull: true })
  location_info: any; // stores location data like address and coordinates

  @Column({ type: DataType.STRING, allowNull: true })
  first_name: string; // stores first name from the profile data
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  reviewer_action!: string;

  @Column({
    type: DataType.JSONB, // You can use JSONB if tasks is an array or object.
    allowNull: true,
  })
  tasks!: object;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  status!: string;

  @Column({
    type: DataType.JSONB, // You can use JSONB if tasks is an array or object.
    allowNull: true,
  })
  status_description!: object;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  status_detail!: string | null; // Allowing null

  // Adding created_by and updated_by columns
  @AllowNull(true)
  @Column({ type: DataType.UUID, allowNull: true })
  created_by: string | null; // Optional UUID

  @AllowNull(true)
  @Column({ type: DataType.UUID, allowNull: true })
  updated_by: string | null; // Optional UUID

  /** Generate `hashed_key` before creation */
  @BeforeValidate
  static generatehashed_key(instance: Vkyc) {
    const randomPart = crypto.randomBytes(16).toString('hex');
    const timestampPart = Date.now().toString(36);
    instance.hashed_key = `${randomPart}${timestampPart}`;
  }

  /** ✅ Log Insert */
  @AfterCreate
  static async logInsert(instance: Vkyc, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    const existingLog = await VkycLog.findOne({
      where: { id: instance.id, dml_action: 'I' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Insert log for ${instance.id} already exists, skipping duplicate entry.`,
      );
      return;
    }

    console.log(`🔵 Logging INSERT for ID: ${instance.id}`);

    await VkycLog.create(
      {
        dml_action: 'I',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        partner_order_id: instance.partner_order_id,
        order_id: instance.order_id,
        attempt_number: instance.attempt_number,
        reference_id: instance.reference_id,
        profile_id: instance.profile_id,
        v_kyc_link: instance.v_kyc_link,
        v_kyc_link_expires: instance.v_kyc_link_expires,
        v_kyc_link_status: instance.v_kyc_link_status,
        v_kyc_comments: instance.v_kyc_comments,
        v_kyc_doc_completion_date: instance.v_kyc_doc_completion_date,
        device_info: instance.device_info,
        profile_data: instance.profile_data,
        performed_by: instance.performed_by,
        resources_documents: instance.resources_documents,
        resources_documents_files: instance.resources_documents_files,
        resources_images: instance.resources_images,
        resources_images_files: instance.resources_images_files,
        resources_videos: instance.resources_videos,
        resources_videos_files: instance.resources_videos_files,
        resources_text: instance.resources_text,
        location_info: instance.location_info,
        first_name: instance.first_name,
        reviewer_action: instance.reviewer_action,
        tasks: instance.tasks,
        status: instance.status,
        status_description: instance.status_description,
        status_detail: instance.status_detail,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
      },
      { transaction: options.transaction ?? null },
    );
  }

  /** ✅ Log Update */
  @AfterUpdate
  static async logUpdate(instance: Vkyc, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping update log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    const existingLog = await VkycLog.findOne({
      where: { id: instance.id, dml_action: 'U' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Update log for ${instance.id} already exists, skipping duplicate entry.`,
      );
      return;
    }

    console.log(`🟡 Logging UPDATE for ID: ${instance.id}`);
    await VkycLog.create(
      {
        dml_action: 'U',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        partner_order_id: instance.partner_order_id,
        order_id: instance.order_id,
        attempt_number: instance.attempt_number,
        reference_id: instance.reference_id,
        profile_id: instance.profile_id,
        v_kyc_link: instance.v_kyc_link,
        v_kyc_link_expires: instance.v_kyc_link_expires,
        v_kyc_link_status: instance.v_kyc_link_status,
        v_kyc_comments: instance.v_kyc_comments,
        v_kyc_doc_completion_date: instance.v_kyc_doc_completion_date,
        device_info: instance.device_info,
        profile_data: instance.profile_data,
        performed_by: instance.performed_by,
        resources_documents: instance.resources_documents,
        resources_documents_files: instance.resources_documents_files,
        resources_images: instance.resources_images,
        resources_images_files: instance.resources_images_files,
        resources_videos: instance.resources_videos,
        resources_videos_files: instance.resources_videos_files,
        resources_text: instance.resources_text,
        location_info: instance.location_info,
        first_name: instance.first_name,
        reviewer_action: instance.reviewer_action,
        tasks: instance.tasks,
        status: instance.status,
        status_description: instance.status_description,
        status_detail: instance.status_detail,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
      },
      { transaction: options.transaction ?? null },
    );
  }

  /** ✅ Log Delete */
  @AfterDestroy
  static async logDelete(instance: Vkyc, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping delete log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    console.log(`🔴 Logging DELETE for ID: ${instance.id}`);

    // 🚨 Prevent duplicate logs
    const existingLog = await VkycLog.findOne({
      where: { id: instance.id, dml_action: 'D' },
      transaction: options.transaction ?? null, // 🛠️ Fix applied here
    });
    if (existingLog) {
      console.log(
        `⚠️ Delete log already exists for ID: ${instance.id}, skipping duplicate.`,
      );
      return;
    }

    await VkycLog.create(
      {
        dml_action: 'D',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        partner_order_id: instance.partner_order_id,
        order_id: instance.order_id,
        attempt_number: instance.attempt_number,
        reference_id: instance.reference_id,
        profile_id: instance.profile_id,
        v_kyc_link: instance.v_kyc_link,
        v_kyc_link_expires: instance.v_kyc_link_expires,
        v_kyc_link_status: instance.v_kyc_link_status,
        v_kyc_comments: instance.v_kyc_comments,
        v_kyc_doc_completion_date: instance.v_kyc_doc_completion_date,
        device_info: instance.device_info,
        profile_data: instance.profile_data,
        performed_by: instance.performed_by,
        resources_documents: instance.resources_documents,
        resources_documents_files: instance.resources_documents_files,
        resources_images: instance.resources_images,
        resources_images_files: instance.resources_images_files,
        resources_videos: instance.resources_videos,
        resources_videos_files: instance.resources_videos_files,
        resources_text: instance.resources_text,
        location_info: instance.location_info,
        first_name: instance.first_name,
        reviewer_action: instance.reviewer_action,
        tasks: instance.tasks,
        status: instance.status,
        status_description: instance.status_description,
        status_detail: instance.status_detail,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
      },
      { transaction: options.transaction ?? null },
    );
  }
}
