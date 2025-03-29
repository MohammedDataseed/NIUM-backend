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
  tableName: 'products_log',
  timestamps: false, // No need for timestamps as we have a log timestamp field
})
export class ProductsLog extends Model<ProductsLog> {
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
  @Column({ type: DataType.STRING, field: 'name' })
  name: string;

  @Column({ type: DataType.TEXT, field: 'description' })
  description: string;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_active' })
  is_active: boolean;

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
