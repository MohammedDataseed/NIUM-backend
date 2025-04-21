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
  BelongsToMany,
  BeforeCreate,
  AutoIncrement,
} from 'sequelize-typescript';
import { Role } from './role.model';
import { Products } from './products.model';
import { User } from './user.model';
import { PartnerProducts } from './partner_products.model';
import * as crypto from 'crypto'; // Import Node.js crypto module

@Table({
  tableName: 'partners',
  timestamps: false, // Sequelize will automatically manage created_at and updated_at
})
export class Partner extends Model<Partner> {
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
  @Column({ type: DataType.STRING, field: 'hashed_key' })
  hashed_key: string;

  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'role_id' })
  role_id: number;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'email' })
  email: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'first_name' })
  first_name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'last_name' })
  last_name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'password' }) // Hash this before saving
  password: string;

  @Unique
  @AllowNull(false)
  @Column({ field: 'api_key', type: DataType.STRING, unique: true })
  api_key: string;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, field: 'is_active' })
  is_active: boolean;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    field: 'business_type',
  })
  business_type: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'created_by' })
  created_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'updated_by' })
  updated_by: string;

  // Associations
  @BelongsTo(() => Role)
  role: Role;

  @BelongsTo(() => User, { foreignKey: 'created_by' })
  creator: User;

  @BelongsTo(() => User, { foreignKey: 'updated_by' })
  updater: User;

  @BelongsToMany(() => Products, () => PartnerProducts)
  products: Products[];

  /** Generate `publicKey` before creation */
  @BeforeCreate
  static generatePublicKey(instance: Partner) {
    const randomPart = crypto.randomBytes(16).toString('hex'); // 16-character random string
    const timestampPart = Date.now().toString(36); // Convert timestamp to base36 for compactness
    instance.hashed_key = `${randomPart}${timestampPart}`; // 16-char random + timestamp
  }
}
