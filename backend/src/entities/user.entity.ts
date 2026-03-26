import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Experience } from './experience.entity';
import { Education } from './education.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { Business } from './business.entity';
import { Rating } from './rating.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  headline: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  cover: string;

  @Column('text', { array: true, default: '{}' })
  skills: string[];

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  phone: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Experience, (exp) => exp.user)
  experiences: Experience[];

  @OneToMany(() => Education, (edu) => edu.user)
  educations: Education[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Business, (biz) => biz.owner)
  businesses: Business[];

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];
}
