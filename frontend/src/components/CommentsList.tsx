import type { PostComment } from "../types/post-comment";
import CommentCard from "./CommentCard";

type CommentsListProps = {
  comments: (PostComment & {
    user: {
      id: number;
      email: string;
      avatarUrl?: string;
    };
  })[];
  postId: number;
  isReplyToComment?: boolean;
};

const CommentsList = ({
  comments,
  postId,
  isReplyToComment,
}: CommentsListProps) => {
  return (
    <div className="space-y-3">
      {comments?.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          postId={postId}
          isReplyToComment={isReplyToComment}
        />
      ))}
    </div>
  );
};

export default CommentsList;
