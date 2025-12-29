import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bookmark } from '../bookmarks/entities/bookmark.entity';
import { Like } from './like.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  imageUrl?: string;

  @Column()
  authorId: number;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @ManyToMany(() => Bookmark, (bookmarks) => bookmarks.posts)
  bookmarks: Bookmark[];
}
