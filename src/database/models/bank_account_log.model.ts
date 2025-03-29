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
  tableName: 'bank_account_log',
  timestamps: false, // Log table timestamps are managed manually
})
export class BankAccountLog extends Model<BankAccountLog> {
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
  @Column({ type: DataType.STRING, field: 'account_holder_name' })
  account_holder_name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'account_number' })
  account_number: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'bank_name' })
  bank_name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'bank_branch' })
  bank_branch: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'ifsc_code' })
  ifsc_code: string;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_beneficiary' })
  is_beneficiary: boolean;

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
