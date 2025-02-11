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
} from "sequelize-typescript";
import { User } from "./user.model";

@Table({
  tableName: "products",
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
  isActive: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "user_id" })
  userId: string;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: "created_at" })
  createdAt: Date;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: "updated_at" })
  updatedAt: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "created_by" })
  created_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "updated_by" })
  updated_by: string;
}
