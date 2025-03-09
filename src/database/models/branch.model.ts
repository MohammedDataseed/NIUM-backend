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

  @AllowNull(false)
  @Unique
  @Column({ type: DataType.STRING, field: "hashed_key" })
  hashed_key: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "created_by" })
  created_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "updated_by" })
  updated_by: string;

  // Generate a hashed key based on branch details
  static generateHashedKey(branch: CreateBranchDto): string {
    const data = `${branch.name}-${branch.location}-${branch.city}-${branch.state}-${branch.business_type}`;
    return crypto.createHash("sha256").update(data).digest("hex");
  }
}
