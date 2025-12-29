import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../../entities/post.entity';

@Entity('bookmarks')
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  userId: number;

  @ManyToMany(() => Post, (post) => post.bookmarks)
  @JoinTable({
    name: 'bookmarks_posts',
    joinColumn: { name: 'bookmark_id' },
    inverseJoinColumn: { name: 'post_id' },
  })
  posts: Post[];
}
