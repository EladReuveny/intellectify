import { useForm } from "@tanstack/react-form";
import { ChevronDown, Reply, Send, ThumbsUp, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import z from "zod";
import {
  useCreatePostComment,
  useToggleLikeComment,
} from "../features/posts/posts.mutations";
import { useFindAllCommentReplies } from "../features/posts/posts.queries";
import { useAuth } from "../hooks/useAuth.hook";
import type { PostComment } from "../types/post-comment";
import { handleError } from "../utils/utils";
import CommentsList from "./CommentsList";
import Spinner from "./Spinner";
import UserAvatar from "./UserAvatar";

const replyCommentSchema = z.object({
  commentReply: z.string(),
});

type CommentCardProps = {
  comment: PostComment & {
    user: {
      id: number;
      email: string;
      avatarUrl?: string;
    };
  };
  postId: number;
  isReplyToComment?: boolean;
};

const CommentCard = ({
  comment,
  postId,
  isReplyToComment = false,
}: CommentCardProps) => {
  const { auth } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showCommentReplies, setShowCommentReplies] = useState(false);

  const { mutate: toggleLikeCommentMutation } = useToggleLikeComment();

  const { mutate: createPostCommentMutation } = useCreatePostComment();

  const {
    data: commentReplies,
    isLoading: isCommentRepliesLoading,
    isError: isCommentRepliesError,
    error: commentRepliesError,
  } = useFindAllCommentReplies(postId, comment.id, {
    enabled: showCommentReplies,
  });

  const handleToggleLikeComment = async () => {
    if (!user) {
      toast.info("Please sign in first to like a comment");
      navigate("/login");
      return;
    }

    toggleLikeCommentMutation({
      postId,
      commentId: comment?.id,
    });
  };

  const isUserLikedComment = comment.likes?.some((l) => l.userId === user?.id);

  const form = useForm({
    defaultValues: {
      commentReply: "",
    },
    validators: {
      onChange: replyCommentSchema,
      onSubmit: replyCommentSchema,
    },
    onSubmit: async ({ value }) =>
      createPostCommentMutation(
        {
          postId,
          createPostCommentDto: {
            content: value.commentReply,
            commentParentId: comment.id,
          },
        },
        {
          onSuccess: () => {
            toast.success("Reply submitted successfully!");
            setShowReplyBox(false);
            setShowCommentReplies(true);
          },
        },
      ),
  });

  if (isCommentRepliesError) {
    handleError(commentRepliesError);
  }

  return (
    <div
      className={`${isReplyToComment ? "" : "border border-(--text-clr)/25 p-4 rounded-md hover:bg-(--text-clr)/15"}`}
    >
      <div className="flex gap-3">
        <Link
          to={`/@${comment.user.email.split("@")[0]}`}
          state={{ userId: comment.user.id }}
          title={`View ${comment.user.email.split("@")[0]}'s profile`}
        >
          <UserAvatar avatarUrl={comment.user.avatarUrl} size={40} />
        </Link>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Link
              to={`/@${comment.user.email.split("@")[0]}`}
              state={{ userId: comment.user.id }}
              title={`View ${comment.user.email.split("@")[0]}'s profile`}
              className="font-semibold"
            >
              @{comment.user.email.split("@")[0]}
            </Link>
            <span className="text-(--text-clr)/60">•</span>
            <span className="text-(--text-clr)/60 text-sm">
              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <p>{comment.content}</p>

          <div className="flex items-center gap-4 text-(--text-clr)/60 mt-2 text-sm">
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="mt-2"
            >
              <form.Field name="commentReply">
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Reply here..."
                      className="outline-none resize-y mb-1 p-2 w-full border border-(--text-clr)/60 rounded hover:border-(--text-clr) focus:border-(--text-clr)"
                    ></textarea>
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <em className="text-red-500 text-sm text-left">
                          {field.state.meta.errors
                            .map((err) => err?.message)
                            .join(", ")}
                        </em>
                      )}
                  </div>
                )}
              </form.Field>

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="reset"
                  onClick={() => setShowReplyBox(false)}
                  className="flex items-center gap-2 py-2 px-3 text-(--text-clr)/60 border border-(--text-clr)/60 rounded-md hover:bg-(--text-clr)/15"
                >
                  <X size={24} /> Cancel
                </button>
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                  {([canSubmit, isSubmitting]) => (
                    <button
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                      className="flex items-center gap-2 py-2 px-4 bg-(--text-clr) text-(--bg-clr) rounded-md hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={24} /> Reply
                    </button>
                  )}
                </form.Subscribe>
              </div>
            </form>
          )}

          {comment.replies && comment.replies?.length > 0 && (
            <details
              open={showCommentReplies}
              onToggle={(e) => setShowCommentReplies(e.currentTarget.open)}
            >
              <summary className="flex items-center gap-1 mt-1 text-sm cursor-pointer text-(--text-clr)/60 hover:text-(--text-clr)">
                <span>
                  {showCommentReplies
                    ? `Hide replies`
                    : `${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`}
                </span>
                <ChevronDown
                  className={`${showCommentReplies ? "rotate-180" : ""}`}
                />
              </summary>

              <div className="mt-3 pl-2 border-l border-(--text-clr)/25 rounded-4xl">
                {isCommentRepliesLoading ? (
                  <Spinner />
                ) : (
                  <CommentsList
                    comments={commentReplies ?? []}
                    postId={postId}
                    isReplyToComment={true}
                  />
                )}
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
