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
  BelongsToMany,
  AfterDestroy,
  AfterUpdate,
  AfterCreate,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Partner } from './partner.model';
import { PartnerProducts } from './partner_products.model';
import { ProductsLog } from './products_log.model'; // Import Log Model
import * as crypto from 'crypto';

@Table({
  tableName: 'products',
  timestamps: true, // Since we have manual created_at & updated_at fields
})
export class Products extends Model<Products> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: 'id' })
  id: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'hashed_key' }) // Add hashed_key
  hashed_key: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'name' })
  name: string;

  @Column({ type: DataType.TEXT, field: 'description' })
  description: string;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, field: 'is_active' })
  is_active: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'created_by' })
  created_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'updated_by' })
  updated_by: string;

  // Many-to-Many Association
  @BelongsToMany(() => Partner, () => PartnerProducts)
  partners: Partner[];

  @BelongsTo(() => User, { foreignKey: 'created_by' })
  creator: User;

  @BelongsTo(() => User, { foreignKey: 'updated_by' })
  updater: User;

  // // Hook to generate hashed_key before creating the product
  // @BeforeCreate
  // static generateHashedKey(instance: Products) {
  //   const hash = crypto
  //     .createHash("sha256")
  //     .update(`${instance.name}-${Date.now()}`) // Use name + timestamp for uniqueness
  //     .digest("hex");
  //   instance.hashed_key = hash;
  // }

  /** Generate `publicKey` before creation */
  @BeforeCreate
  static generatePublicKey(instance: Products) {
    const randomPart = crypto.randomBytes(16).toString('hex'); // 16-character random string
    const timestampPart = Date.now().toString(36); // Convert timestamp to base36 for compactness
    instance.hashed_key = `${randomPart}${timestampPart}`; // 16-char random + timestamp
  }

  /** ✅ Log Insert */
  @AfterCreate
  static async logInsert(instance: Products, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    const existingLog = await ProductsLog.findOne({
      where: { id: instance.id, dml_action: 'I' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Insert log for ${instance.id} already exists, skipping duplicate entry.`,
      );
      return;
    }

    console.log(`🔵 Logging INSERT for ID: ${instance.id}`);
    await ProductsLog.create(
      {
        dml_action: 'I',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        name: instance.name,
        description: instance.description,
        is_active: instance.is_active,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt ?? new Date(),
      },
      { transaction: options.transaction ?? null },
    );
  }

  /** ✅ Log Update */
  @AfterUpdate
  static async logUpdate(instance: Products, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping update log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    const existingLog = await ProductsLog.findOne({
      where: { id: instance.id, dml_action: 'U' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Update log for ${instance.id} already exists, skipping duplicate entry.`,
      );
      return;
    }

    console.log(`🟡 Logging UPDATE for ID: ${instance.id}`);

    await ProductsLog.create(
      {
        dml_action: 'U',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        name: instance.name,
        description: instance.description,
        is_active: instance.is_active,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
      },
      { transaction: options.transaction ?? null },
    );
  }

  /** ✅ Log Delete */
  @AfterDestroy
  static async logDelete(instance: Products, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping delete log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    const existingLog = await ProductsLog.findOne({
      where: { id: instance.id, dml_action: 'D' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Delete log for ${instance.id} already exists, skipping duplicate entry.`,
      );
      return;
    }

    console.log(`🔴 Logging DELETE for ID: ${instance.id}`);

    await ProductsLog.create(
      {
        dml_action: 'D',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        name: instance.name,
        description: instance.description,
        is_active: instance.is_active,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
      },
      { transaction: options.transaction ?? null },
    );
  }
}
