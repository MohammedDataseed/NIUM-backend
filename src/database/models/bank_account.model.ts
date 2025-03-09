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
  accountHolderName: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "account_number" })
  accountNumber: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "bank_name" })
  bankName: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "bank_branch" })
  bankBranch: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "ifsc_code" })
  ifscCode: string;

  @Column({ type: DataType.BOOLEAN, field: "is_beneficiary" })
  isBeneficiary: boolean;

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
}
