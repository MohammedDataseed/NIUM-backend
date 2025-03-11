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
  BeforeCreate,
} from "sequelize-typescript";
import { User } from "./user.model";
import * as crypto from "crypto";

@Table({
  tableName: "bank_accounts",
  timestamps: true,
})
export class bank_account extends Model<bank_account> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: "id" })
  id: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "hashed_key" })
  hashed_key: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "account_holder_name" })
  account_holder_name: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "account_number" })
  account_number: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "bank_name" })
  bank_name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "bank_branch" })
  bank_branch: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "ifsc_code" })
  ifsc_code: string;

  @Column({
    type: DataType.BOOLEAN,
    field: "is_beneficiary",
    defaultValue: false,
  })
  is_beneficiary: boolean;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.UUID, field: "created_by" })
  created_by: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.UUID, field: "updated_by" })
  updated_by: string;

  /**
   * Generates a hashed key based on essential bank account details.
   */
  @BeforeCreate
  static generatehashed_key(instance: bank_account) {
    const randomPart = crypto.randomBytes(16).toString("hex"); // 16-character random string
    const timestampPart = Date.now().toString(36); // Convert timestamp to base36 for compactness
    instance.hashed_key = `${randomPart}${timestampPart}`; // 16-char random + timestamp
  }
}
