import { Reply, Send, ThumbsUp, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createPostComment, toggleLikeComment } from "../api/posts.api";
import { useAuth } from "../hooks/useAuth.hook";
import type { PostComment } from "../types/post-comment";
import { handleError } from "../utils/utils";
import CommentsList from "./CommentsList";
import UserAvatar from "./UserAvatar";

type CommentCardProps = {
  comment: PostComment;
  setComments: React.Dispatch<React.SetStateAction<PostComment[]>>;
  isReplyToComment?: boolean;
};

const CommentCard = ({
  comment,
  setComments,
  isReplyToComment = false,
}: CommentCardProps) => {
  const { auth } = useAuth();
  const user = auth?.user;
  const username = user?.email?.split("@")[0];

  const navigate = useNavigate();

  const [showReplyBox, setShowReplyBox] = useState(false);

  const handleToggleLikeComment = async () => {
    try {
      if (!user) {
        toast.info("Please sign in first to like a comment");
        navigate("/login");
        return;
      }

      const data = await toggleLikeComment(comment?.post?.id, comment?.id);
      setComments((prev) => prev.map((c) => (c.id === comment.id ? data : c)));
    } catch (err) {
      handleError(err);
    }
  };

  const isUserLikedComment = comment.likes?.some((l) => l.userId === user?.id);

  const handleSubmitReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.info("Please sign in first to reply a comment");
      navigate("/login");
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const data = await createPostComment(comment.post?.id, {
        content: formData.get("commentReply") as string,
        commentParentId: comment.id,
      });

      setComments((prev) => addReplyToTree(prev, comment.id, data));
      setShowReplyBox(false);
    } catch (err) {
      handleError(err);
    }
  };

  const addReplyToTree = (
    comments: PostComment[],
    parentId: number,
    reply: PostComment,
  ): PostComment[] => {
    return comments.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies ?? []), reply],
        };
      }

      if (comment.replies?.length) {
        return {
          ...comment,
          replies: addReplyToTree(comment.replies, parentId, reply),
        };
      }

      return comment;
    });
  };

  return (
    <div
      className={`${isReplyToComment ? "" : "border border-(--text-clr)/25 p-4 rounded-md hover:bg-(--text-clr)/15"}`}
    >
      <div className="flex gap-3">
        <div>
          <UserAvatar size={40} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{username}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400 text-sm">
              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <p>{comment.content}</p>

          <div className="flex items-center gap-4 text-gray-400 mt-2 text-sm">
            <div className="flex items-start gap-1">
              <button type="button" onClick={handleToggleLikeComment}>
                <ThumbsUp
                  className={`${
                    isUserLikedComment
                      ? "fill-(--text-clr) stroke-1"
                      : "hover:stroke-(--text-clr)"
                  } 
                    hover:scale-105`}
                />
              </button>
              {comment.likes?.length ?? 0}
            </div>

            <button
              type="button"
              onClick={() => setShowReplyBox((prev) => !prev)}
              className="flex gap-1 hover:text-(--text-clr)"
            >
              <Reply />
              Reply
            </button>
          </div>

          {showReplyBox && (
            <form onSubmit={(e) => handleSubmitReply(e)} className="mt-2">
              <textarea
                name="commentReply"
                id="commentReply"
                placeholder="Reply here..."
                className="outline-none resize-y mb-1 p-2 w-full border border-gray-400 rounded hover:border-(--text-clr) focus:border-(--text-clr)"
              ></textarea>

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="reset"
                  onClick={() => setShowReplyBox(false)}
                  className="flex items-center gap-2 py-2 px-3 text-gray-400 border border-gray-400 rounded-md hover:bg-(--text-clr)/10"
                >
                  <X size={24} /> Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 py-2 px-4 bg-(--text-clr) text-(--bg-clr) rounded-md hover:brightness-90"
                >
                  <Send size={24} /> Reply
                </button>
              </div>
            </form>
          )}

          {comment.replies && (
            <div className="mt-3 pl-2 border-l border-(--text-clr)/25 rounded-4xl">
              <CommentsList
                comments={comment.replies}
                setComments={setComments}
                isReplyToComment={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
