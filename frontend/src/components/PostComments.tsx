import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createPostComment, findAllPostComments } from "../api/posts.api";
import { useAuth } from "../hooks/useAuth.hook";
import type { PostComment } from "../types/post-comment";
import type { Post } from "../types/post.types";
import { handleError } from "../utils/utils";
import CommentsList from "./CommentsList";

type PostCommentsProps = { post: Post };

const PostComments = ({ post }: PostCommentsProps) => {
  const [comments, setComments] = useState<PostComment[]>([]);

  const { auth } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllPostComments = async () => {
      try {
        const data = await findAllPostComments(post.id);
        setComments(data);
      } catch (err) {
        handleError(err);
      }
    };

    fetchAllPostComments();
  }, []);

  const handlePostNewComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.info("Please sign in first to comment on a post");
      navigate("/login");
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const data = await createPostComment(post.id, {
        content: formData.get("new-comment") as string,
      });
      setComments((prev) => [...prev, data]);
    } catch (err) {
      handleError(err);
    }
  };

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

      {comments.length ? (
        <CommentsList comments={comments} setComments={setComments} />
      ) : (
        <p className="text-gray-400 text-center">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
};

export default PostComments;
