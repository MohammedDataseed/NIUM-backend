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
  tableName: "roles",
  timestamps: true,
})
export class Role extends Model<Role> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: "id" })
  id: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(
      "admin",
      "co-admin",
      "maker",
      "checker",
      "maker-checker"
    ),
    field: "name",
  })
  name: string;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, field: "status" })
  status: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "created_by" })
  created_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "updated_by" })
  updated_by: string;

  // @Default(DataType.NOW)
  // @Column({ type: DataType.DATE, field: "created_at" })
  // created_at: Date;

  // @Default(DataType.NOW)
  // @Column({ type: DataType.DATE, field: "updated_at" })
  // updated_at: Date;

  // // Add these relationships
  // @BelongsTo(() => User, "created_by")
  // creator: User;

  // @BelongsTo(() => User, "updated_by")
  // updater: User;
}
