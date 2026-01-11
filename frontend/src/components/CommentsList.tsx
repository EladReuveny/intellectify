import type { PostComment } from "../types/post-comment";
import CommentCard from "./CommentCard";

type CommentsListProps = {
  comments: PostComment[];
  setComments: React.Dispatch<React.SetStateAction<PostComment[]>>;
};

const CommentsList = ({ comments, setComments }: CommentsListProps) => {
  return (
    <div className="space-y-2">
      {comments?.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          setComments={setComments}
        />
      ))}
    </div>
  );
};

export default CommentsList;
