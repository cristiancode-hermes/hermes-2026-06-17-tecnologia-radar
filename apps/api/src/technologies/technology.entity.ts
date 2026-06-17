import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { Vote } from '../votes/vote.entity';

@Entity('technologies')
export class Technology {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  websiteUrl: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ type: 'real', default: 0 })
  avgScore: number;

  @Column({ default: 0 })
  voteCount: number;

  @Column({ type: 'real', default: 0 })
  trend: number;

  @ManyToOne(() => Category, (c) => c.technologies)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Vote, (v) => v.technology)
  votes: Vote[];
}
