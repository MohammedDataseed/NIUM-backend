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
  tableName: "branches",
  timestamps: true,
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
  business_type: string;

  // Timestamps & User Tracking
  // @Default(DataType.NOW)
  // @Column({ type: DataType.DATE, field: "created_at" })
  // created_at: Date;

  // @Default(DataType.NOW)
  // @Column({ type: DataType.DATE, field: "updated_at" })
  // updated_at: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "created_by" })
  created_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "updated_by" })
  updated_by: string;

  // // Associations
  // @BelongsTo(() => User, { foreignKey: "created_by" })
  // creator: User;

  // @BelongsTo(() => User, { foreignKey: "updated_by" })
  // updater: User;
}
