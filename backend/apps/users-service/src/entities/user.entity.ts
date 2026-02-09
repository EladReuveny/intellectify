import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({ type: 'text', nullable: true })
  avatarUrl?: string;

  @ManyToMany(() => User, (user) => user.followers)
  @JoinTable({
    name: 'followers_following',
    joinColumn: { name: 'followerId' },
    inverseJoinColumn: { name: 'followedId' },
  })
  following: User[];

  @ManyToMany(() => User, (user) => user.following)
  followers: User[];
}
