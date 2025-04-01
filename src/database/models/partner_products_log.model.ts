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
  tableName: 'partner_products_log',
  timestamps: false, // Disable timestamps since log_timestamp handles it
})
export class PartnerProductsLog extends Model<PartnerProductsLog> {
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
  @Column({ type: DataType.STRING, field: 'partner_id' })
  partner_id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'partner_id' })
  product_id: string;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'createdAt' })
  createdAt: Date;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'updatedAt' })
  updatedAt: Date;
}
