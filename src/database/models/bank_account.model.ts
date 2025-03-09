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

  @AllowNull(false)
  @Unique
  @Column({ type: DataType.STRING, field: "hashed_key" })
  hashed_key: string;

  @Column({ type: DataType.BOOLEAN, field: "is_beneficiary", defaultValue: false })
  is_beneficiary: boolean;

  // @ForeignKey(() => User)
  // @AllowNull(false)
  // @Column({ type: DataType.UUID, field: "created_by" })
  // created_by: string;

  // @ForeignKey(() => User)
  // @AllowNull(false)
  // @Column({ type: DataType.UUID, field: "updated_by" })
  // updated_by: string;

  /**
   * Generates a hashed key based on essential bank account details.
   */
  static generateHashedKey(account: {
    account_holder_name: string;
    account_number: string;
    bank_name: string;
    bank_branch: string;
    ifsc_code: string;
  }): string {
    const data = `${account.account_holder_name}-${account.account_number}-${account.bank_name}-${account.bank_branch}-${account.ifsc_code}`;
    return crypto.createHash("sha256").update(data).digest("hex");
  }
}
