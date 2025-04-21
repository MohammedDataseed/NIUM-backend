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
  BeforeCreate,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Partner } from './partner.model';
import { PartnerProducts } from './partner_products.model';
import * as crypto from 'crypto';

@Table({
  tableName: 'products',
  timestamps: false, // Since we have manual created_at & updated_at fields
})
export class Products extends Model<Products> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: 'id' })
  id: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'hashed_key' }) // Add hashed_key
  hashed_key: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'name' })
  name: string;

  @Column({ type: DataType.TEXT, field: 'description' })
  description: string;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, field: 'is_active' })
  is_active: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'created_by' })
  created_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'updated_by' })
  updated_by: string;

  // Many-to-Many Association
  @BelongsToMany(() => Partner, () => PartnerProducts)
  partners: Partner[];

  @BelongsTo(() => User, { foreignKey: 'created_by' })
  creator: User;

  @BelongsTo(() => User, { foreignKey: 'updated_by' })
  updater: User;

  /** Generate `publicKey` before creation */
  @BeforeCreate
  static generatePublicKey(instance: Products) {
    const randomPart = crypto.randomBytes(16).toString('hex'); // 16-character random string
    const timestampPart = Date.now().toString(36); // Convert timestamp to base36 for compactness
    instance.hashed_key = `${randomPart}${timestampPart}`; // 16-char random + timestamp
  }
}
