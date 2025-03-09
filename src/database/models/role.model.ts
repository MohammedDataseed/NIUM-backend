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
} from "sequelize-typescript";
import { User } from "./user.model";
import * as crypto from "crypto";

@Table({
  tableName: "roles",
  timestamps: true,
})
export class Role extends Model<Role> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: "id" })
  id: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "hashed_key" }) // Add hashed_key
  hashed_key: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM("admin", "co-admin", "maker", "checker", "maker-checker"),
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

  @BelongsTo(() => User, "created_by")
  creator: User;

  @BelongsTo(() => User, "updated_by")
  updater: User;

  @BeforeCreate
  static generateHashedKey(instance: Role) {
    const hash = crypto
      .createHash("sha256")
      .update(`${instance.name}-${Date.now()}`) // Use name + timestamp for uniqueness
      .digest("hex");
    instance.hashed_key = hash;
  }
}