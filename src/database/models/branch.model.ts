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
  tableName: "branches",
})
export class Branch extends Model<Branch> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: "id" })
  id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "name" })
  name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "location" })
  location: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "city" })
  city: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "state" })
  state: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM("cash&carry", "large_enterprise"),
    field: "business_type",
  })
  businessType: string;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: "created_at" })
  createdAt: Date;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: "updated_at" })
  updatedAt: Date;

  @ForeignKey(() => User)
  @AllowNull(true)  // Make it optional
  @Column({ type: DataType.UUID, field: "created_by" })
  created_by?: string;
  
  @ForeignKey(() => User)
  @AllowNull(true)  // Make it optional
  @Column({ type: DataType.UUID, field: "updated_by" })
  updated_by?: string;
  
}
