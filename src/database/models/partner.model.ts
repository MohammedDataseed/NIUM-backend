import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  DataType,
} from "sequelize-typescript";

@Table({
  tableName: "partner",
})
export class Partner extends Model<Partner> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.SMALLINT,
    field: "partner_id",
  })
  partnerid: number;

  @Column({
    field: "name",
  })
  name: string | null;

  @AllowNull
  @Column({
    field: "description",
  })
  description: string | null;

  @Unique
  @Column({
    field: "partner_key",
  })
  partnerKey: string;

  @Column({
    field: "type",
  })
  type: string;

  @Column({ type: DataType.JSONB, field: "config" })
  config: any;

  @Column({
    field: "is_active",
    type: DataType.BOOLEAN,
  })
  isActive: boolean;

  @Column({
    field: "created_at",
  })
  createdAt: Date;

  @Column({
    field: "created_by",
  })
  created_by: number;

  @Column({
    field: "updated_at",
  })
  updatedAt: Date;

  @Column({
    field: "updated_by",
  })
  updated_by: number;

  @Column({
    field: "code",
  })
  code: string;

  @Column({ type: DataType.JSONB, field: "notification_config" })
  notificationConfig: JSON;
}
