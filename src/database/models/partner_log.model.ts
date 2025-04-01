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
  tableName: 'partner_log',
  timestamps: false, // Log table timestamps are managed manually
})
export class PartnerLog extends Model<PartnerLog> {
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
  id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'hashed_key' })
  hashed_key: string;

  @AllowNull(false)
  @Column({ type: DataType.UUID, field: 'role_id' })
  role_id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'email' })
  email: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'first_name' })
  first_name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'last_name' })
  last_name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'password' }) // Ensure hashing before storage
  password: string;

  @AllowNull(false)
  @Column({ field: 'api_key', type: DataType.STRING })
  api_key: string;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_active' })
  is_active: boolean;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'business_type' })
  business_type: string;

  @AllowNull(false)
  @Column({ type: DataType.UUID, field: 'created_by' })
  created_by: string;

  @AllowNull(false)
  @Column({ type: DataType.UUID, field: 'updated_by' })
  updated_by: string;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'createdAt' })
  createdAt: Date;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'updatedAt' })
  updatedAt: Date;
}
