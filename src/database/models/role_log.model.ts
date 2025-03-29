import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  AllowNull,
  ForeignKey,
  Default,
} from 'sequelize-typescript';
import { Role } from './role.model';

@Table({
  tableName: 'role_log',
  timestamps: false, // Log table does not need timestamps
})
export class RoleLog extends Model<RoleLog> {
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

  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column({ type: DataType.UUID, field: 'id' })
  id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'hashed_key' })
  hashed_key: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(
      'admin',
      'co-admin',
      'maker',
      'checker',
      'maker-checker',
    ),
    field: 'name',
  })
  name: string;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, field: 'status' })
  status: boolean;

  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column({ type: DataType.UUID, field: 'created_by' })
  created_by: string;

  @ForeignKey(() => Role)
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
