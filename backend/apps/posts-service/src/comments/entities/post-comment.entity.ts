import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Like } from '../../entities/like.entity';
import { Post } from '../../entities/post.entity';

@Entity('post_comments')
export class PostComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Like, (like) => like.comment)
  likes: Like[];

  @Column()
  userId: number;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ nullable: true })
  commentsParentId?: number;

  @OneToMany(() => PostComment, (reply) => reply.commentsParentId, {
    nullable: true,
  })
  replies?: PostComment[];
}
