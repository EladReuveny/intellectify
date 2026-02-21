import { Calendar, ThumbsUp, UserMinus, UserPlus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ErrorFallback from "../components/ErrorFallback";
import PageTitle from "../components/PageTitle";
import PostComments from "../components/PostComments";
import Spinner from "../components/Spinner";
import UserAvatar from "../components/UserAvatar";
import { useToggleLikePost } from "../features/posts/posts.mutations";
import { useFindPost } from "../features/posts/posts.queries";
import {
  useFollowUser,
  useUnfollowUser,
} from "../features/users/users.mutations";
import { useGetUser } from "../features/users/users.queries";
import { useAuth } from "../hooks/useAuth.hook";
import { handleError } from "../utils/utils";

type PostsDetailsProps = {};

const PostDetails = ({}: PostsDetailsProps) => {
  const { postId } = useParams();

  const { auth } = useAuth();
  const user = auth?.user;

  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
    error: postError,
  } = useFindPost(Number(postId));

  const {
    data: author,
    isLoading: isAuthorLoading,
    isError: isAuthorError,
    error: authorError,
  } = useGetUser(post?.authorId!);

  const { mutate: toggleLikePostMutation } = useToggleLikePost();

  const { mutate: followUserMutation } = useFollowUser();

  const { mutate: unfollowUserMutation } = useUnfollowUser();

  const isUserLikedPost = post?.likes?.some((like) => like.userId === user?.id);

  const isUserFollowingAuthor = author?.followers?.some(
    (f) => f.id === user?.id,
  );

  const handleToggleFollow = () => {
    if (!author?.id) return;

    if (isUserFollowingAuthor) {
      unfollowUserMutation(author?.id);
    } else {
      followUserMutation(author?.id);
    }
  };

  const isLoading = isPostLoading || isAuthorLoading;
  if (isLoading) {
    return <Spinner />;
  }

  const isError = isPostError || isAuthorError;
  if (isError) {
    const error = postError || authorError;
    handleError(error);
    return <ErrorFallback error={error!} />;
  }

  return (
    <article className="px-2">
      <PageTitle title="Post Details" />

      <main>
        <h2 className="text-3xl font-bold mb-2">{post?.title}</h2>

        <div className="flex items-center gap-3 mb-2 text-lg">
          <Link
            to={`/@${author?.email.split("@")[0]}`}
            state={{ userId: author?.id }}
            title={`View ${author?.email.split("@")[0]}'s profile`}
            className="flex items-center gap-2 group"
          >
            <UserAvatar avatarUrl={author?.avatarUrl} size={30} />
            <span className="text-gray-400 group-hover:text-(--text-clr)">
              @{author?.email.split("@")[0]}
            </span>
          </Link>

          <button
            onClick={handleToggleFollow}
            className={`px-4 py-1 text-sm rounded-full mt-2 flex items-center gap-2 ${
              isUserFollowingAuthor
                ? "text-gray-400 border border-gray-400 hover:bg-(--text-clr)/15"
                : "bg-(--text-clr) text-(--bg-clr) hover:brightness-90"
            }`}
          >
            {isUserFollowingAuthor ? (
              <>
                <UserMinus /> Unfollow
              </>
            ) : (
              <>
                <UserPlus /> Follow
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div
            title="Created at"
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-(--text-clr)"
          >
            <Calendar size={20} />
            {post?.createdAt &&
              new Date(post.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <button
              type="button"
              onClick={() => toggleLikePostMutation(post?.id!)}
              title={isUserLikedPost ? "Unlike" : "Like"}
            >
              <ThumbsUp
                size={20}
                className={`${
                  isUserLikedPost
                    ? "fill-(--text-clr) stroke-1"
                    : "hover:stroke-(--text-clr)"
                } hover:scale-105`}
              />{" "}
            </button>
            {post?.likes.length}
          </div>
        </div>

        <img
          src={post?.imageUrl || undefined}
          alt={post?.title}
          title={post?.title}
          className="w-3/4 object-contain mx-auto my-4"
        />

        <p>{post?.content}</p>
      </main>

      <hr className="text-(--text-clr)/35 my-4" />

      {post && <PostComments post={post} />}
    </article>
  );
};

export default PostDetails;
