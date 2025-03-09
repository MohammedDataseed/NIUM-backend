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
} from "sequelize-typescript";
import { User } from "./user.model";
import { Partner } from "./partner.model";
import { PartnerProducts } from "./partner_products.model";
import * as crypto from "crypto";

@Table({
  tableName: "products",
  timestamps: true, // Since we have manual created_at & updated_at fields
})
export class Products extends Model<Products> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: "id" })
  id: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "hashed_key" }) // Add hashed_key
  hashed_key: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "name" })
  name: string;

  @Column({ type: DataType.TEXT, field: "description" })
  description: string;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, field: "is_active" })
  is_active: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "created_by" })
  created_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "updated_by" })
  updated_by: string;

  // Many-to-Many Association
  @BelongsToMany(() => Partner, () => PartnerProducts)
  partners: Partner[];

  @BelongsTo(() => User, { foreignKey: "created_by" })
  creator: User;

  @BelongsTo(() => User, { foreignKey: "updated_by" })
  updater: User;

  // Hook to generate hashed_key before creating the product
  @BeforeCreate
  static generateHashedKey(instance: Products) {
    const hash = crypto
      .createHash("sha256")
      .update(`${instance.name}-${Date.now()}`) // Use name + timestamp for uniqueness
      .digest("hex");
    instance.hashed_key = hash;
  }
}
