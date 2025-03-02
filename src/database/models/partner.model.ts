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
} from "sequelize-typescript";
import { Role } from "./role.model";
import { Products } from "./products.model";
import { User } from "./user.model";
import { PartnerProducts } from "./partner_products.model"; // Many-to-Many Table

@Table({
  tableName: "partners",
  timestamps: false,
})
export class Partner extends Model<Partner> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: "id" })
  id: string;

  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column({ type: DataType.UUID, field: "role_id" })
  role_id: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "email" })
  email: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "first_name" })
  first_name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "last_name" })
  last_name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "password" }) // Hash this before saving
  password: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "api_key" })
  api_key: string;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, field: "is_active" })
  is_active: boolean;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM("large_enterprise", "cash&carry"),
    field: "business_type",
  })
  business_type: string;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: "created_at" })
  created_at: Date;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: "updated_at" })
  updated_at: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "created_by" })
  created_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "updated_by" })
  updated_by: string;

  // Associations
  @BelongsTo(() => Role)
  role: Role;

  @BelongsTo(() => User, { foreignKey: "created_by" })
  creator: User;

  @BelongsTo(() => User, { foreignKey: "updated_by" })
  updater: User;

  @BelongsToMany(() => Products, () => PartnerProducts)
  products: Products[];
}
