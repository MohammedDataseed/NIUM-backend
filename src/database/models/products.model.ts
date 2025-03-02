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
} from "sequelize-typescript";
import { User } from "./user.model";

@Table({
  tableName: "products",
  timestamps: false, // Since we have manual created_at & updated_at fields
})
export class Products extends Model<Products> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: "id" })
  id: string;

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

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: "created_at" })
  created_at: Date;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: "updated_at" })
  updated_at: Date;

  // Associations
  @BelongsTo(() => User, { foreignKey: "created_by" })
  creator: User;

  @BelongsTo(() => User, { foreignKey: "updated_by" })
  updater: User;
}
