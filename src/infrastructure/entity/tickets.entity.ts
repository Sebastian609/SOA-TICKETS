import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,

} from "typeorm";

@Entity("tbl_tickets")
export class Ticket {
  @PrimaryGeneratedColumn({ name: "ticket_id" })
  id: number;

  @Column({ name: "event_location_id", nullable: false })
  eventLocationId: number;

  @Column({ name: "code", length: 255, nullable: true, unique: true })
  code: string;

  @Column({ name: "used_at", nullable: true })
  usedAt: Date;

  @Column({ name: "is_used", default: false })
  isUsed: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "is_active", default: true })
  isActive: boolean;

  @Column({ name: "deleted", default: false })
  deleted: boolean;
} 