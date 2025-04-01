import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
  DataType,
  AutoIncrement,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'users_log',
  timestamps: true,
})
export class UsersLog extends Model<UsersLog> {
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

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.UUID, field: 'id' })
  id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'email' })
  email: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'password' })
  password: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'role_id' })
  role_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'branch_id' })
  branch_id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'hashed_key' })
  hashed_key: string;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_active' })
  is_active: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  created_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  updated_by: string;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'createdAt' })
  createdAt: Date;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'updatedAt' })
  updatedAt: Date;
}
