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

  @ManyToOne(() => PostComment, (commentParent) => commentParent.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_parent_id' })
  commentParent?: PostComment;

  @OneToMany(() => PostComment, (reply) => reply.commentParent, {
    nullable: true,
  })
  replies?: PostComment[];
}
