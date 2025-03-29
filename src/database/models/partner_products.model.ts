import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  AfterCreate,
  AfterUpdate,
  AfterDestroy,
} from 'sequelize-typescript';
import { Partner } from './partner.model';
import { Products } from './products.model';
import { PartnerProductsLog } from './partner_products_log.model';

@Table({
  tableName: 'partner_products',
  timestamps: true, // Enable timestamps for this table
})
export class PartnerProducts extends Model<PartnerProducts> {
  @ForeignKey(() => Partner)
  @Column({ type: DataType.UUID, field: 'partner_id' })
  partner_id: string;

  @ForeignKey(() => Products)
  @Column({ type: DataType.UUID, field: 'product_id' })
  product_id: string;

  /** ✅ Log Insert */
  @AfterCreate
  static async logInsert(instance: PartnerProducts, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(`⏳ Skipping insert log, transaction not committed yet.`);
      return;
    }

    const existingLog = await PartnerProductsLog.findOne({
      where: { id: instance.id, dml_action: 'I' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Insert log for ${instance.id} already exists, skipping duplicate entry.`,
      );
      return;
    }

    console.log(
      `🔵 Logging INSERT for Partner: ${instance.partner_id}, Product: ${instance.product_id}`,
    );

    await PartnerProductsLog.create(
      {
        dml_action: 'I',
        log_timestamp: new Date(),
        partner_id: instance.partner_id,
        product_id: instance.product_id,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt ?? new Date(),
      },
      { transaction: options.transaction ?? null },
    );
  }

  /** ✅ Log Update */
  @AfterUpdate
  static async logUpdate(instance: PartnerProducts, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(`⏳ Skipping update log, transaction not committed yet.`);
      return;
    }

    const existingLog = await PartnerProductsLog.findOne({
      where: { id: instance.id, dml_action: 'U' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Update log for ${instance.id} already exists, skipping duplicate entry.`,
      );
      return;
    }

    console.log(
      `🟡 Logging UPDATE for Partner: ${instance.partner_id}, Product: ${instance.product_id}`,
    );

    await PartnerProductsLog.create(
      {
        dml_action: 'U',
        log_timestamp: new Date(),
        partner_id: instance.partner_id,
        product_id: instance.product_id,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
      },
      { transaction: options.transaction ?? null },
    );
  }

  /** ✅ Log Delete */
  @AfterDestroy
  static async logDelete(instance: PartnerProducts, options: any) {
    if (options.transaction && options.transaction.finished !== 'commit') {
      console.log(`⏳ Skipping delete log, transaction not committed yet.`);
      return;
    }

    const existingLog = await PartnerProductsLog.findOne({
      where: { id: instance.id, dml_action: 'D' },
      transaction: options.transaction ?? null,
    });

    if (existingLog) {
      console.log(
        `⚠️ Delete log for ${instance.id} already exists, skipping duplicate entry.`,
      );
      return;
    }

    console.log(
      `🔴 Logging DELETE for Partner: ${instance.partner_id}, Product: ${instance.product_id}`,
    );

    await PartnerProductsLog.create(
      {
        dml_action: 'D',
        log_timestamp: new Date(),
        partner_id: instance.partner_id,
        product_id: instance.product_id,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
      },
      { transaction: options.transaction ?? null },
    );
  }
}
