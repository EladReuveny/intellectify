import { Calendar, ThumbsUp, UserMinus, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { findPost, toggleLikePost } from "../api/posts.api";
import { followUser, getUser, unfollowUser } from "../api/users.api";
import PageTitle from "../components/PageTitle";
import PostComments from "../components/PostComments";
import UserAvatar from "../components/UserAvatar";
import { useAuth } from "../hooks/useAuth.hook";
import type { Post } from "../types/post.types";
import type { User } from "../types/user.types";
import { handleError } from "../utils/utils";

type PostsDetailsProps = {};

const PostDetails = ({}: PostsDetailsProps) => {
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<User | null>(null);

  const { postId } = useParams();

  const { auth } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();

  const isUserLikedPost = post?.likes?.some((like) => like.userId === user?.id);

  const isUserFollowingAuthor = author?.followers?.some(
    (f) => f.id === user?.id,
  );

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const data = await findPost(Number(postId));
        setPost(data);
      } catch (err) {
        handleError(err);
      }
    };

    const fetchAuthorData = async () => {
      try {
        const data = await getUser(post?.authorId!);
        setAuthor(data);
      } catch (err) {
        handleError(err);
      }
    };

    fetchPostDetails();
    fetchAuthorData();
  }, []);

  const handleToggleLikePost = async () => {
    try {
      if (!user) {
        toast.info("Please sign in first to like a post");
        navigate("/login");
        return;
      }

      const updatedPost = await toggleLikePost(Number(postId));
      setPost(updatedPost);
    } catch (err) {
      handleError(err);
    }
  };

  const handleToggleFollow = async () => {
    try {
      if (isUserFollowingAuthor) {
        await unfollowUser(author?.id!);
        setAuthor((prev) =>
          prev
            ? {
                ...prev,
                followers: (prev.followers ?? []).filter(
                  (f) => f.id !== user?.id,
                ),
              }
            : prev,
        );
      } else {
        const data = await followUser(author?.id!);
        setAuthor((prev) =>
          prev
            ? {
                ...prev,
                followers: [...(prev.followers ?? []), data],
              }
            : prev,
        );
      }
    } catch (err) {
      handleError(err);
    }
  };

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
              {author?.email.split("@")[0]}
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
              onClick={handleToggleLikePost}
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
