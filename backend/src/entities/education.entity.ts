import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('educations')
export class Education {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  degree: string;

  @Column()
  institution: string;

  @Column({ nullable: true })
  year: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.educations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
