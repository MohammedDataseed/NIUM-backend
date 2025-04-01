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
  tableName: 'order_log',
  timestamps: false, // The table already has log_timestamp instead of createdAt/updatedAt for logging
})
export class OrderLog extends Model<OrderLog> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  log_id: number;

  @AllowNull(false)
  @Column({ type: DataType.ENUM('I', 'D', 'U'), field: 'dml_action' })
  dml_action: 'I' | 'D' | 'U';

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: 'log_timestamp' })
  log_timestamp: Date;

  @AllowNull(false)
  @Column({ type: DataType.UUID, field: 'id' })
  id!: string;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER, field: 'serial_number' })
  serial_number!: number;

  @Column({ type: DataType.STRING, field: 'nium_order_id' })
  nium_order_id!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'hashed_key' })
  hashed_key!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'partner_id' })
  partner_id!: string;

  @Column({ type: DataType.STRING, field: 'partner_hashed_api_key' })
  partner_hashed_api_key!: string;

  @Column({ type: DataType.STRING, field: 'partner_hashed_key' })
  partner_hashed_key!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'partner_order_id' })
  partner_order_id!: string;

  @Column({ type: DataType.STRING, field: 'transaction_type' })
  transaction_type!: string;

  @Column({ type: DataType.STRING, field: 'purpose_type' })
  purpose_type!: string;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_esign_required' })
  is_esign_required!: boolean;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_v_kyc_required' })
  is_v_kyc_required!: boolean;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'customer_name' })
  customer_name!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'customer_email' })
  customer_email!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'customer_phone' })
  customer_phone!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'customer_pan' })
  customer_pan!: string;

  @Column({ type: DataType.STRING, field: 'order_status' })
  order_status!: string;

  @Column({ type: DataType.STRING, field: 'e_sign_status' })
  e_sign_status!: string;

  @Column({ type: DataType.STRING, field: 'e_sign_link' })
  e_sign_link!: string;

  @Column({ type: DataType.STRING, field: 'e_sign_link_status' })
  e_sign_link_status!: string;

  @Column({ type: DataType.STRING, field: 'e_sign_link_doc_id' })
  e_sign_link_doc_id!: string;

  @Column({ type: DataType.STRING, field: 'e_sign_link_request_id' })
  e_sign_link_request_id!: string;

  @Column({ type: DataType.DATE, field: 'e_sign_link_expires' })
  e_sign_link_expires!: Date;

  @Column({ type: DataType.BOOLEAN, field: 'e_sign_completed_by_customer' })
  e_sign_completed_by_customer!: boolean;

  @Column({ type: DataType.DATE, field: 'e_sign_customer_completion_date' })
  e_sign_customer_completion_date!: Date;

  @Column({ type: DataType.STRING, field: 'e_sign_doc_comments' })
  e_sign_doc_comments!: string;

  @Column({ type: DataType.STRING, field: 'v_kyc_reference_id' })
  v_kyc_reference_id!: string;

  @Column({ type: DataType.STRING, field: 'v_kyc_profile_id' })
  v_kyc_profile_id!: string;

  @Column({ type: DataType.STRING, field: 'v_kyc_status' })
  v_kyc_status!: string;

  @Column({ type: DataType.STRING, field: 'v_kyc_link' })
  v_kyc_link!: string;

  @Column({ type: DataType.STRING, field: 'v_kyc_link_status' })
  v_kyc_link_status!: string;

  @Column({ type: DataType.DATE, field: 'v_kyc_link_expires' })
  v_kyc_link_expires!: Date;

  @Column({ type: DataType.BOOLEAN, field: 'v_kyc_completed_by_customer' })
  v_kyc_completed_by_customer!: boolean;

  @Column({ type: DataType.DATE, field: 'v_kyc_customer_completion_date' })
  v_kyc_customer_completion_date!: Date;

  @Column({ type: DataType.STRING, field: 'v_kyc_comments' })
  v_kyc_comments!: string;

  @Column({ type: DataType.STRING, field: 'incident_checker_comments' })
  incident_checker_comments!: string;

  @Column({ type: DataType.STRING, field: 'nium_invoice_number' })
  nium_invoice_number!: string;

  @Column({ type: DataType.DATE, field: 'date_of_departure' })
  date_of_departure!: Date;

  @Column({ type: DataType.DATE, field: 'incident_completion_date' })
  incident_completion_date!: Date;

  @Column({
    type: DataType.BOOLEAN,
    field: 'is_esign_regenerated',
    defaultValue: false,
  })
  is_esign_regenerated!: boolean;

  @Column({ type: DataType.JSONB, field: 'is_esign_regenerated_details' })
  is_esign_regenerated_details!: object;

  @Column({
    type: DataType.BOOLEAN,
    field: 'is_video_kyc_link_regenerated',
    defaultValue: false,
  })
  is_video_kyc_link_regenerated!: boolean;

  @Column({
    type: DataType.JSONB,
    field: 'is_video_kyc_link_regenerated_details',
  })
  is_video_kyc_link_regenerated_details!: object;

  @Column({ type: DataType.BOOLEAN, field: 'incident_status' })
  incident_status!: boolean;

  @Column({ type: DataType.UUID, field: 'created_by' })
  created_by!: string;

  @Column({ type: DataType.UUID, field: 'updated_by' })
  updated_by!: string;

  @Column({ type: DataType.UUID, field: 'checker_id' })
  checker_id!: string;

  @Column({ type: DataType.JSONB, field: 'merged_document' })
  merged_document!: object;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'createdAt' })
  createdAt!: Date;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'updatedAt' })
  updatedAt!: Date;
}
