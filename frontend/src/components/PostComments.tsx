import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
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

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const data = await createPostComment(post.id, {
        content: formData.get("new-comment") as string,
        userId: user?.id!,
        postId: post.id,
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
          className="outline-none resize-y mb-1 p-2 w-full border border-gray-400 rounded hover:border-(--text-color) focus:border-(--text-color)"
        ></textarea>
        <button
          type="submit"
          className="flex items-center gap-2 py-2 px-3 bg-(--text-clr) text-(--bg-clr) rounded hover:brightness-90"
        >
          Comment
        </button>
      </form>

      <CommentsList comments={comments} setComments={setComments} />
    </div>
  );
};

export default PostComments;
