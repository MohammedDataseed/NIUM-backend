import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
  DataType,
  ForeignKey,
  BelongsTo,
  BeforeValidate,
  AutoIncrement,
} from 'sequelize-typescript';
import { User } from './user.model';
import * as crypto from 'crypto';

@Table({
  tableName: 'roles',
  timestamps: false,
})
export class Role extends Model<Role> {
  // @PrimaryKey
  // @Default(DataType.UUIDV4)
  // @Column({ type: DataType.UUID, field: 'id' })
  // id: string;
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT, field: 'id' })
  id: number;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'hashed_key' }) // Add hashed_key
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

  @Default(true)
  @Column({ type: DataType.BOOLEAN, field: 'status' })
  status: boolean;

  // @ForeignKey(() => User)
  // @Column({ type: DataType.UUID, field: 'created_by' })
  // created_by: string;

  // @ForeignKey(() => User)
  // @Column({ type: DataType.UUID, field: 'updated_by' })
  // updated_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, field: 'created_by' })
  created_by: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, field: 'updated_by' })
  updated_by: number;

  @BelongsTo(() => User, 'created_by')
  creator: User;

  @BelongsTo(() => User, 'updated_by')
  updater: User;

  // @Column({ type: DataType.DATE, field: 'created_at' })
  // created_at: Date;

  /** Generate `publicKey` before creation */
  @BeforeValidate
  static generatePublicKey(instance: Role) {
    const randomPart = crypto.randomBytes(16).toString('hex'); // 16-character random string
    const timestampPart = Date.now().toString(36); // Convert timestamp to base36 for compactness
    instance.hashed_key = `${randomPart}${timestampPart}`; // 16-char random + timestamp
  }
}
