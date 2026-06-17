import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Technology } from '../technologies/technology.entity';

@Entity('votes')
@Unique(['userId', 'technologyId'])
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  score: number; // 1-5

  @Column({ type: 'text', nullable: true })
  comment: string;

  @ManyToOne(() => User, (u) => u.votes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Technology, (t) => t.votes)
  @JoinColumn({ name: 'technologyId' })
  technology: Technology;

  @Column()
  technologyId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
