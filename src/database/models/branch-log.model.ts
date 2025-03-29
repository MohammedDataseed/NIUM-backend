import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
  DataType,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
} from 'sequelize-typescript';
import { User } from './user.model';
const BUSINESS_TYPE_ENUM = ['cash&carry', 'large_enterprise'] as const;
@Table({
  tableName: 'branch_logs',
  timestamps: false, // No need for automatic timestamps as we handle it manually
})
export class BranchLog extends Model<BranchLog> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  log_id: number;

  @AllowNull(false)
  @Column({ type: DataType.ENUM('I', 'U', 'D') })
  dml_action!: string;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE })
  log_timestamp!: Date;

  @AllowNull(false)
  @Column({ type: DataType.UUID, field: 'id' })
  id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'hashed_key' })
  hashed_key: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'name' })
  name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'location' })
  location: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'city' })
  city: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'state' })
  state: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'business_type' })
  business_type: string;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'createdAt' })
  createdAt: Date;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'updatedAt' })
  updatedAt: Date;

  @ForeignKey(() => User) BranchLog;
  @AllowNull(true)
  @Column({ type: DataType.UUID, field: 'created_by' })
  created_by?: string;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ type: DataType.UUID, field: 'updated_by' })
  updated_by?: string;

  @BelongsTo(() => User, { foreignKey: 'created_by' })
  creator: User;

  @BelongsTo(() => User, { foreignKey: 'updated_by' })
  updater: User;
}
