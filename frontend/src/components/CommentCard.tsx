import { Reply, ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toggleLikeComment } from "../api/posts.api";
import { useAuth } from "../hooks/useAuth.hook";
import type { PostComment } from "../types/post-comment";
import { handleError } from "../utils/utils";
import UserAvatar from "./UserAvatar";

type CommentCardProps = {
  comment: PostComment;
  setComments: React.Dispatch<React.SetStateAction<PostComment[]>>;
};

const CommentCard = ({ comment, setComments }: CommentCardProps) => {
  const { auth } = useAuth();
  const user = auth?.user;
  const username = user?.email?.split("@")[0];

  const navigate = useNavigate();

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

  return (
    <div className="border border-(--text-clr)/25 p-4 rounded-md">
      <div className="flex gap-3">
        <div>
          <UserAvatar size={40} />
        </div>

        <div>
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
            <div className="flex gap-2">
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
              className="flex gap-2 hover:text-(--text-clr)"
            >
              <Reply />
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
