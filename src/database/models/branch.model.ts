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
  BeforeValidate,
} from "sequelize-typescript";
import * as crypto from "crypto";
import { User } from "./user.model";
import { CreateBranchDto } from "src/dto/branch.dto";
@Table({
  tableName: "branches",
  timestamps: true,
})
export class Branch extends Model<Branch> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: "id" })
  id: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "hashed_key" })
  hashed_key: string;

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

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "created_by" })
  created_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "updated_by" })
  updated_by: string;

  /** Generate `hashed_key` before creation */
  @BeforeValidate
  static generatehashed_key(instance: Branch) {
    const randomPart = crypto.randomBytes(16).toString("hex"); // 16-character random string
    const timestampPart = Date.now().toString(36); // Convert timestamp to base36 for compactness
    instance.hashed_key = `${randomPart}${timestampPart}`; // 16-char random + timestamp
  }
}
