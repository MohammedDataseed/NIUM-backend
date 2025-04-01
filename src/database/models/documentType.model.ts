//documentType.model.ts
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
  BeforeUpdate,
  BeforeDestroy,
  AfterCreate,
  AfterUpdate,
  AfterDestroy,
  BeforeValidate,
  Unique,
  DataType,
} from "sequelize-typescript";
import { DocumentTypeLog } from "./document_type_log.model";
import { User } from "./user.model";
import * as crypto from "crypto";

@Table({
  tableName: "document_type", // Matches migration table name
  timestamps: true, // Enables createdAt & updatedAt
  underscored: true, // Uses snake_case for DB columns
})
export class DocumentType extends Model<DocumentType> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id!: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "hashed_key" })
  hashed_key: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "name" })
  name!: string;

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

  /** Generate `hashed_key` before creation */
  // @BeforeCreate
  @BeforeValidate
  static generateHashedKey(instance: DocumentType) {
    const randomPart = crypto.randomBytes(16).toString("hex"); // 16-character random string
    const timestampPart = Date.now().toString(36); // Convert timestamp to base36 for compactness
    instance.hashed_key = `${randomPart}${timestampPart}`; // 16-char random + timestamp
  }
  
  @AfterCreate
  static async logInsert(instance: DocumentType, options: any) {
    if (options.transaction && options.transaction.finished !== "commit") {
      console.log(`⏳ Skipping log for ${instance.id}, transaction not committed yet.`);
      return;
    }
  
    console.log(`🔵 Logging INSERT for ID: ${instance.id}`);
  
    // 🚨 Check if a log already exists to prevent duplicates
    const existingLog = await DocumentTypeLog.findOne({ where: { id: instance.id } });
    if (existingLog) {
      console.log(`⚠️ Log already exists for ID: ${instance.id}, skipping duplicate log.`);
      return;
    }
  
    await DocumentTypeLog.create(
      {
        dml_action: "I",
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        name: instance.name,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
        created_at: instance.createdAt,
        updated_at: instance.updatedAt ?? new Date(),
      },
      { transaction: options.transaction ?? null }
    );
  }
  
  @AfterUpdate
static async logUpdate(instance: DocumentType, options: any) {
  if (options.transaction && options.transaction.finished !== "commit") {
    console.log(`⏳ Skipping update log for ${instance.id}, transaction not committed yet.`);
    return;
  }

  console.log(`🟡 Logging UPDATE for ID: ${instance.id}`);

  // 🚨 Check if a log for this update already exists
  const existingLog = await DocumentTypeLog.findOne({ 
    where: { id: instance.id, dml_action: "U" } 
  });
  if (existingLog) {
    console.log(`⚠️ Update log already exists for ID: ${instance.id}, skipping duplicate.`);
    return;
  }

  await DocumentTypeLog.create(
    {
      dml_action: "U",
      log_timestamp: new Date(),
      id: instance.id,
      hashed_key: instance.hashed_key,
      name: instance.name,
      is_active: instance.isActive,
      created_at: instance.createdAt,
      updated_at: instance.updatedAt,
      created_by: instance.created_by,
      updated_by: instance.updated_by,
    },
    { transaction: options.transaction ?? null }
  );
}

@AfterDestroy
static async logDelete(instance: DocumentType, options: any) {
  if (options.transaction && options.transaction.finished !== "commit") {
    console.log(`⏳ Skipping delete log for ${instance.id}, transaction not committed yet.`);
    return;
  }

  console.log(`🔴 Logging DELETE for ID: ${instance.id}`);

  // 🚨 Check if a delete log already exists
  const existingLog = await DocumentTypeLog.findOne({ 
    where: { id: instance.id, dml_action: "D" } 
  });
  if (existingLog) {
    console.log(`⚠️ Delete log already exists for ID: ${instance.id}, skipping duplicate.`);
    return;
  }

  await DocumentTypeLog.create(
    {
      dml_action: "D",
      log_timestamp: new Date(),
      id: instance.id,
      hashed_key: instance.hashed_key,
      name: instance.name,
      is_active: instance.isActive,
      created_at: instance.createdAt,
      updated_at: instance.updatedAt,
      created_by: instance.created_by,
      updated_by: instance.updated_by,
    },
    { transaction: options.transaction ?? null }
  );
}


}
