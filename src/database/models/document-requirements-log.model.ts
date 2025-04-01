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
  tableName: 'document_requirements_log',
  timestamps: false, // Log timestamps are managed manually
})
export class DocumentRequirementsLog extends Model<DocumentRequirementsLog> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'log_id' })
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
  @Column({ type: DataType.STRING, field: 'document_type' })
  document_type: string;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_required' })
  is_required: boolean;

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
