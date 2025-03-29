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
  BelongsToMany,
  BeforeCreate,
  AfterCreate,
  AfterUpdate,
  AfterDestroy,
} from 'sequelize-typescript';
import { Role } from './role.model';
import { Products } from './products.model';
import { User } from './user.model';
import { PartnerProducts } from './partner_products.model';
import { PartnerLog } from './partner_log.model'; // Import the Log Model
import * as crypto from 'crypto'; // Import Node.js crypto module

@Table({
  tableName: 'partners',
  timestamps: true, // Sequelize will automatically manage createdAt and updatedAt
})
export class Partner extends Model<Partner> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, field: 'id' })
  id: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'hashed_key' })
  hashed_key: string;

  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column({ type: DataType.UUID, field: 'role_id' })
  role_id: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'email' })
  email: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'first_name' })
  first_name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'last_name' })
  last_name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: 'password' }) // Hash this before saving
  password: string;

  @Unique
  @AllowNull(false)
  @Column({ field: 'api_key', type: DataType.STRING, unique: true })
  api_key: string;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, field: 'is_active' })
  is_active: boolean;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    field: 'business_type',
  })
  business_type: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'created_by' })
  created_by: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'updated_by' })
  updated_by: string;

  // Associations
  @BelongsTo(() => Role)
  role: Role;

  @BelongsTo(() => User, { foreignKey: 'created_by' })
  creator: User;

  @BelongsTo(() => User, { foreignKey: 'updated_by' })
  updater: User;

  @BelongsToMany(() => Products, () => PartnerProducts)
  products: Products[];

  // // Hook to generate hashed_key before creating the record
  // @BeforeCreate
  // static generateHashedKey(instance: Partner) {
  //   if (!instance.id) {
  //     throw new Error("ID must be set before generating hashed_key");
  //   }

  //   const hash = crypto
  //     .createHash("sha256") // You can use md5, sha256, etc.
  //     .update(instance.id + Date.now().toString()) // Combine id and timestamp for uniqueness
  //     .digest("hex"); // Output as hexadecimal string
  //   instance.hashed_key = hash;

  /** Generate `publicKey` before creation */
  @BeforeCreate
  static generatePublicKey(instance: Partner) {
    const randomPart = crypto.randomBytes(16).toString('hex'); // 16-character random string
    const timestampPart = Date.now().toString(36); // Convert timestamp to base36 for compactness
    instance.hashed_key = `${randomPart}${timestampPart}`; // 16-char random + timestamp
  }

  /** ✅ Log Insert */
  @AfterCreate
  static async logInsert(instance: Partner, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    console.log(`🔵 Logging INSERT for ID: ${instance.id}`);

    await PartnerLog.create(
      {
        dml_action: 'I',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        role_id: instance.role_id,
        email: instance.email,
        first_name: instance.first_name,
        last_name: instance.last_name,
        password: instance.password,
        api_key: instance.api_key,
        is_active: instance.is_active,
        business_type: instance.business_type,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt ?? new Date(),
        created_by: instance.created_by,
        updated_by: instance.updated_by,
      },
      { transaction: options.transaction ?? null },
    );
  }

  /** ✅ Log Update */
  @AfterUpdate
  static async logUpdate(instance: Partner, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping update log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    console.log(`🟡 Logging UPDATE for ID: ${instance.id}`);

    await PartnerLog.create(
      {
        dml_action: 'U',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        role_id: instance.role_id,
        email: instance.email,
        first_name: instance.first_name,
        last_name: instance.last_name,
        password: instance.password,
        api_key: instance.api_key,
        is_active: instance.is_active,
        business_type: instance.business_type,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
      },
      { transaction: options.transaction ?? null },
    );
  }

  /** ✅ Log Delete */
  @AfterDestroy
  static async logDelete(instance: Partner, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(
        `⏳ Skipping delete log for ${instance.id}, transaction not committed yet.`,
      );
      return;
    }

    console.log(`🔴 Logging DELETE for ID: ${instance.id}`);

    await PartnerLog.create(
      {
        dml_action: 'D',
        log_timestamp: new Date(),
        id: instance.id,
        hashed_key: instance.hashed_key,
        role_id: instance.role_id,
        email: instance.email,
        first_name: instance.first_name,
        last_name: instance.last_name,
        password: instance.password,
        api_key: instance.api_key,
        is_active: instance.is_active,
        business_type: instance.business_type,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
        created_by: instance.created_by,
        updated_by: instance.updated_by,
      },
      { transaction: options.transaction ?? null },
    );
  }
}
