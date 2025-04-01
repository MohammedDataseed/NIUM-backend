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
  tableName: 'esign_log',
  timestamps: false, // No need for timestamps as we have a log timestamp field
})
export class ESignLog extends Model<ESignLog> {
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

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'task_id' })
  task_id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'group_id' })
  group_id: string;

  @AllowNull(false)
  @Column({ type: DataType.JSONB, field: 'esign_file_details' })
  esign_file_details: object;

  @AllowNull(false)
  @Column({ type: DataType.JSONB, field: 'esign_stamp_details' })
  esign_stamp_details: object;

  @AllowNull(false)
  @Column({ type: DataType.JSONB, field: 'esign_invitees' })
  esign_invitees: object;

  @Column({ type: DataType.JSONB, allowNull: true, field: 'esign_details' })
  esign_details: object;

  @Column({ type: DataType.STRING, allowNull: true, field: 'esign_doc_id' })
  esign_doc_id: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'status' })
  status: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'request_id' })
  request_id: string;

  @Column({ type: DataType.DATE, allowNull: true, field: 'completed_at' })
  completed_at: Date;

  @Column({ type: DataType.DATE, allowNull: true, field: 'esign_expiry' })
  esign_expiry: Date;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, field: 'active' })
  active: boolean;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, field: 'expired' })
  expired: boolean;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, field: 'rejected' })
  rejected: boolean;

  // 🔥 Additional Fields
  @Column({ type: DataType.JSONB, allowNull: true, field: 'result' })
  result: object;

  @Column({ type: DataType.JSONB, allowNull: true, field: 'esigners' })
  esigners: object;

  @Column({ type: DataType.JSONB, allowNull: true, field: 'file_details' })
  file_details: object;

  @Column({ type: DataType.JSONB, allowNull: true, field: 'request_details' })
  request_details: object;

  @Column({ type: DataType.STRING, allowNull: true, field: 'esign_irn' })
  esign_irn: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'esign_folder' })
  esign_folder: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'esign_type' })
  esign_type: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'esign_url' })
  esign_url: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'esigner_email' })
  esigner_email: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'esigner_phone' })
  esigner_phone: string;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_signed' })
  is_signed: boolean;

  @Column({ type: DataType.STRING, allowNull: true, field: 'type' })
  type: string;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'createdAt' })
  createdAt: Date;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'updatedAt' })
  updatedAt: Date;
}
