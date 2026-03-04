import { UserMinus, UserPlus } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorFallback from "../components/ErrorFallback";
import PageTitle from "../components/PageTitle";
import PostsList from "../components/PostsList";
import Spinner from "../components/Spinner";
import UserAvatar from "../components/UserAvatar";
import {
  useFollowUser,
  useUnfollowUser,
} from "../features/users/users.mutations";
import { useFindUserPosts, useGetUser } from "../features/users/users.queries";
import { useAuth } from "../hooks/useAuth.hook";
import { handleError } from "../utils/utils";

type PublicProfileProps = {};

const PublicProfile = ({}: PublicProfileProps) => {
  let { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userId: number = location.state?.userId;
  username = username?.replace("@", "");

  const { auth } = useAuth();
  const currentUser = auth?.user;

  useEffect(() => {
    if (!userId) {
      navigate("/");
      toast.error("Something went wrong. Please try again.");
      return;
    }
  }, []);

  const {
    data: publicUser,
    isLoading: isPublicUserLoading,
    isError: isPublicUserError,
    error: publicUserError,
  } = useGetUser(userId);

  const {
    data: posts,
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
  } = useFindUserPosts(userId);

  const isCurrentUserFollowingUser = publicUser?.followers?.some(
    (f) => f.id === currentUser?.id,
  );

  const { mutate: followUserMutation } = useFollowUser();

  const { mutate: unfollowUserMutation } = useUnfollowUser();

  const toggleFollowUser = () => {
    if (!publicUser?.id) return;

    if (isCurrentUserFollowingUser) {
      unfollowUserMutation(publicUser.id);
    } else {
      followUserMutation(publicUser.id);
    }
  };

  if (isPublicUserLoading || isPostsLoading) {
    return <Spinner />;
  }

  if (isPublicUserError) {
    handleError(publicUserError);
    return <ErrorFallback error={publicUserError} />;
  }

  if (isPostsError) {
    handleError(postsError);
    return <ErrorFallback error={postsError} />;
  }

  return (
    <section className="px-2">
      <PageTitle title={`@${username}`} />

      <div className="flex items-center justify-center gap-4 mb-8">
        <div>
          <UserAvatar avatarUrl={publicUser?.avatarUrl} size={120} />
        </div>

        <div>
          <h3 className="font-bold text-2xl">
            @{publicUser?.email.split("@")[0]}
          </h3>
          <div className="flex items-center gap-1.5 text-(--text-clr)/60">
            <span>{posts?.length} posts</span>
            <span>•</span>
            <span>{publicUser?.followers?.length ?? 0} followers</span>
            <span>•</span>
            <span>
              Joined {""}
              {publicUser?.createdAt &&
                new Date(publicUser.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
            </span>
          </div>
          <button
            onClick={toggleFollowUser}
            className={`px-4 py-1 text-sm rounded-full mt-2 flex items-center gap-2 ${
              isCurrentUserFollowingUser
                ? "text-(--text-clr)/60 border border-(--text-clr)/60 hover:bg-(--text-clr)/15"
                : "bg-(--text-clr) text-(--bg-clr) hover:brightness-90"
            }`}
          >
            {isCurrentUserFollowingUser ? (
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
      </div>

      {posts?.length ? (
        <PostsList posts={posts} showRemovePost={false} />
      ) : (
        <div className="text-center py-12">
          <h2 className="font-bold text-2xl mb-1">No posts found</h2>
          <p className="text-(--text-clr)/60">
            This user hasn't created any posts yet.
          </p>
        </div>
      )}
    </section>
  );
};

export default PublicProfile;
