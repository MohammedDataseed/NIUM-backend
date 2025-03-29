import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
  DataType,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  tableName: 'vkyc_log',
  timestamps: false, // No need for timestamps as we have log_timestamp
})
export class VkycLog extends Model<VkycLog> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  log_id: number;

  @AllowNull(false)
  @Column({ type: DataType.ENUM('I', 'U', 'D'), field: 'dml_action' })
  dml_action: 'I' | 'U' | 'D';

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
    field: 'log_timestamp',
    defaultValue: DataType.NOW,
  })
  log_timestamp: Date;

  @AllowNull(false)
  @Column({ type: DataType.UUID, field: 'id' })
  id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'hashed_key' })
  hashed_key: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'partner_order_id' })
  partner_order_id: string;

  @AllowNull(false)
  @Column({ type: DataType.UUID, field: 'order_id' })
  order_id: string;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER, field: 'attempt_number' })
  attempt_number: number;

  @Column({ type: DataType.STRING, field: 'reference_id' })
  reference_id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'profile_id' })
  profile_id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'v_kyc_link' })
  v_kyc_link: string;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'v_kyc_link_expires' })
  v_kyc_link_expires: Date;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'v_kyc_link_status' })
  v_kyc_link_status: string;

  @Column({ type: DataType.STRING, field: 'v_kyc_comments' })
  v_kyc_comments: string;

  @Column({ type: DataType.DATE, field: 'v_kyc_doc_completion_date' })
  v_kyc_doc_completion_date: Date;

  @Column({ type: DataType.JSONB, field: 'device_info' })
  device_info: any;

  @Column({ type: DataType.JSONB, field: 'profile_data' })
  profile_data: any;

  @Column({ type: DataType.JSONB, field: 'performed_by' })
  performed_by: any[];

  @Column({ type: DataType.JSONB, field: 'resources_documents' })
  resources_documents: any[];

  @Column({ type: DataType.JSONB, field: 'resources_documents_files' })
  resources_documents_files: any[];

  @Column({ type: DataType.JSONB, field: 'resources_images' })
  resources_images: any[];

  @Column({ type: DataType.JSONB, field: 'resources_images_files' })
  resources_images_files: any[];

  @Column({ type: DataType.JSONB, field: 'resources_videos' })
  resources_videos: any[];

  @Column({ type: DataType.JSONB, field: 'resources_videos_files' })
  resources_videos_files: any[];

  @Column({ type: DataType.JSONB, field: 'resources_text' })
  resources_text: any[];

  @Column({ type: DataType.JSONB, field: 'location_info' })
  location_info: any;

  @Column({ type: DataType.STRING, field: 'first_name' })
  first_name: string;

  @Column({ type: DataType.STRING, field: 'reviewer_action' })
  reviewer_action: string;

  @Column({ type: DataType.JSONB, field: 'tasks' })
  tasks: object;

  @Column({ type: DataType.STRING, field: 'status' })
  status: string;

  @Column({ type: DataType.JSONB, field: 'status_description' })
  status_description: object;

  @Column({ type: DataType.STRING, field: 'status_detail' })
  status_detail: string | null;

  @AllowNull(true)
  @Column({ type: DataType.UUID, field: 'created_by' })
  created_by: string | null;

  @AllowNull(true)
  @Column({ type: DataType.UUID, field: 'updated_by' })
  updated_by: string | null;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'createdAt' })
  createdAt: Date;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'updatedAt' })
  updatedAt: Date;
}
