import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
  BeforeCreate,
  Unique,
  DataType,
} from "sequelize-typescript";

import { User } from "./user.model";
import * as crypto from "crypto";

@Table({
  tableName: "purposes", // Matches migration table name
  timestamps: true, // Enables createdAt & updatedAt
  underscored: true, // Uses snake_case for DB columns
})
export class Purpose extends Model<Purpose> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: "id" })
  id: string;

  @AllowNull(false)
  @Unique
  //@Default(() => crypto.randomBytes(8).toString("hex"))
  @Column({ type: DataType.STRING, field: "hashed_key" })
  hashed_key: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "purpose_name" })
  purposeName: string;

  @AllowNull(false)
  @Default(true)
  @Column({ type: DataType.BOOLEAN, field: "is_active" })
  isActive: boolean;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: "created_at" })
  createdAt: Date;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: "updated_at" })
  updatedAt: Date;

  @ForeignKey(() => User)
  @AllowNull(true) // Make it optional
  @Column({ type: DataType.UUID, field: "created_by" })
  created_by?: string;

  @ForeignKey(() => User)
  @AllowNull(true) // Make it optional
  @Column({ type: DataType.UUID, field: "updated_by" })
  updated_by?: string;

  // Associations

  @BelongsTo(() => User, { foreignKey: "created_by" })
  creator: User;

  @BelongsTo(() => User, { foreignKey: "updated_by" })
  updater: User;

  // /** Generate `hashed_key` before creation */
  // @BeforeCreate
  // static generatehashed_key(instance: Purpose) {
  //   instance.hashed_key = crypto.randomBytes(8).toString("hex"); // Generates a random unique key
  // }

  /** Generate `publicKey` before creation */
  @BeforeCreate
  static generatePublicKey(instance: Purpose) {
    const randomPart = crypto.randomBytes(16).toString("hex"); // 16-character random string
    const timestampPart = Date.now().toString(36); // Convert timestamp to base36 for compactness
    instance.hashed_key = `${randomPart}${timestampPart}`; // 16-char random + timestamp
  }
}
