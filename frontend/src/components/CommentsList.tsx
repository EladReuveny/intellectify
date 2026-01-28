import type { PostComment } from "../types/post-comment";
import CommentCard from "./CommentCard";

type CommentsListProps = {
  comments: PostComment[];
  setComments: React.Dispatch<React.SetStateAction<PostComment[]>>;
  isReplyToComment?: boolean;
};

const CommentsList = ({ comments, setComments, isReplyToComment}: CommentsListProps) => {
  return (
    <div className="space-y-2">
      {comments?.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          setComments={setComments}
          isReplyToComment={isReplyToComment}
        />
      ))}
    </div>
  );
};

export default CommentsList;
