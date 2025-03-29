import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'transaction_type_log',
  timestamps: false, // Logs should not auto-update timestamps
  underscored: true,
})
export class TransactionTypeLog extends Model<TransactionTypeLog> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER, autoIncrement: true })
  log_id!: number;

  @AllowNull(false)
  @Column({ type: DataType.ENUM('I', 'U', 'D') })
  dml_action!: string;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE })
  log_timestamp!: Date;

  @AllowNull(false)
  @Column({ type: DataType.UUID })
  id!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  hashed_key!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  name!: string;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN })
  is_active!: boolean;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  created_at!: Date;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  updated_at!: Date;

  @AllowNull(true)
  @Column({ type: DataType.UUID })
  created_by?: string;

  @AllowNull(true)
  @Column({ type: DataType.UUID })
  updated_by?: string;
}
