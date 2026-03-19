import { useForm } from "@tanstack/react-form";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import z from "zod";
import { useCreatePostComment } from "../features/posts/posts.mutations";
import { useFetchAllRootComments } from "../features/posts/posts.queries";
import { useAuth } from "../hooks/useAuth.hook";
import type { Post } from "../types/post.types";
import { handleError } from "../utils/utils";
import CommentsList from "./CommentsList";
import ErrorFallback from "./ErrorFallback";
import Spinner from "./Spinner";

const postCommentSchema = z.object({
  newComment: z.string().min(1, "Comment is required"),
});

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
  } = useFetchAllRootComments(post.id);

  const { mutate: createPostCommentMutation } = useCreatePostComment();

  const form = useForm({
    defaultValues: {
      newComment: "",
    },
    validators: {
      onChange: postCommentSchema,
      onSubmit: postCommentSchema,
    },
    onSubmit: ({ value }) =>
      createPostCommentMutation(
        {
          postId: post.id,
          createPostCommentDto: {
            content: value.newComment,
          },
        },
        {
          onSuccess: () => {
            toast.success("Comment submitted successfully!");
            form.reset();
          },
        },
      ),
  });

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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="mb-4"
      >
        <form.Field name="newComment">
          {(field) => (
            <div className="flex flex-col gap-1">
              <textarea
                name={field.name}
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                required
                placeholder="Write a comment here..."
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
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="flex items-center gap-2 py-2 px-3 bg-(--text-clr) text-(--bg-clr) rounded mt-2 hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Comment
            </button>
          )}
        </form.Subscribe>
      </form>

      {comments?.length ? (
        <CommentsList comments={comments} postId={post.id} />
      ) : (
        <p className="text-(--text-clr)/60 text-center">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
};

export default PostComments;
