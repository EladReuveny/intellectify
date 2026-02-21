import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreatePostComment } from "../features/posts/posts.mutations";
import { useFetchAllPostComments } from "../features/posts/posts.queries";
import { useAuth } from "../hooks/useAuth.hook";
import type { Post } from "../types/post.types";
import { handleError } from "../utils/utils";
import CommentsList from "./CommentsList";
import ErrorFallback from "./ErrorFallback";
import Spinner from "./Spinner";

type PostCommentsProps = { post: Post };

const PostComments = ({ post }: PostCommentsProps) => {
  const { auth } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();

  const {
    data: comments,
    isLoading,
    isError,
    error,
  } = useFetchAllPostComments(post.id);

  const { mutate: createPostCommentMutation } = useCreatePostComment();

  const handlePostNewComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.info("Please sign in first to comment on a post");
      navigate("/login");
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    createPostCommentMutation(
      {
        postId: post.id,
        createPostCommentDto: {
          content: formData.get("new-comment") as string,
        },
      },
      {
        onSuccess: () => {
          toast.success("Comment submitted successfully!");
          form.reset();
        },
      },
    );
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    handleError(error);
    return <ErrorFallback error={error} />;
  }

  return (
    <div>
      <h1 className="text-lg flex items-center gap-2 mb-2">
        <MessageCircle />
        Comments
      </h1>
      <form onSubmit={(e) => handlePostNewComment(e)} className="mb-4">
        <textarea
          name="new-comment"
          id="new-comment"
          required
          placeholder="Write a comment here..."
          className="outline-none resize-y mb-1 p-2 w-full border border-gray-400 rounded hover:border-(--text-clr) focus:border-(--text-clr)"
        ></textarea>
        <button
          type="submit"
          className="flex items-center gap-2 py-2 px-3 bg-(--text-clr) text-(--bg-clr) rounded hover:brightness-90"
        >
          Comment
        </button>
      </form>

      {comments?.length ? (
        <CommentsList comments={comments} postId={post.id} />
      ) : (
        <p className="text-gray-400 text-center">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
};

export default PostComments;
