import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import { Purpose } from './purpose.model';
import { User } from './user.model';

@Table({
  tableName: 'purpose_logs',
  timestamps: false,
  underscored: true,
})
export class PurposeLog extends Model<PurposeLog> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  log_id: number;

  @Column({
    type: DataType.ENUM('I', 'D', 'U'),
    allowNull: false,
    field: 'dml_action',
  })
  dml_action: 'I' | 'D' | 'U';

  @Default(() => new Date())
  @Column({ type: DataType.DATE, field: 'log_timestamp' })
  log_timestamp: Date;

  @ForeignKey(() => Purpose)
  @AllowNull(false)
  @Column({ type: DataType.UUID, field: 'id' })
  id: string;

  @Column({ type: DataType.STRING, field: 'hashed_key' })
  hashed_key: string;

  @Column({ type: DataType.STRING, field: 'purpose_name' })
  purpose_name: string;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_active', defaultValue: true })
  is_active: boolean;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'created_at' })
  created_at: Date;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'updated_at' })
  updated_at: Date;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ type: DataType.UUID, field: 'created_by' })
  created_by?: string;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ type: DataType.UUID, field: 'updated_by' })
  updated_by?: string;

  @BelongsTo(() => Purpose, { foreignKey: 'id' })
  purpose: Purpose;

  @BelongsTo(() => User, { foreignKey: 'created_by' })
  creator: User;

  @BelongsTo(() => User, { foreignKey: 'updated_by' })
  updater: User;
}
