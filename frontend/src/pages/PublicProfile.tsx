import { useAtom } from "jotai";
import { UserMinus, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  findUserPosts,
  followUser,
  getUser,
  unfollowUser,
} from "../api/users.api";
import Loading from "../components/Loading";
import PageTitle from "../components/PageTitle";
import PostsList from "../components/PostsList";
import UserAvatar from "../components/UserAvatar";
import { useAuth } from "../hooks/useAuth.hook";
import { postsAtom } from "../store/posts.atom";
import type { User } from "../types/user.types";
import { handleError } from "../utils/utils";

type PublicProfileProps = {};

const PublicProfile = ({}: PublicProfileProps) => {
  const [posts, setPosts] = useAtom(postsAtom);
  const [publicUser, setPublicUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  let { username } = useParams();
  username = username?.replace("@", "");

  const { auth } = useAuth();
  const currentUser = auth?.user;

  const location = useLocation();
  const { userId } = location.state;

  const navigate = useNavigate();

  const isCurrentUserFollowingUser = publicUser?.followers?.some(
    (f) => f.id === currentUser?.id,
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!username) {
          navigate("/");
          toast.error("Username not provided");
          return;
        }

        const userData = await getUser(Number(userId));
        setPublicUser(userData);

        const postsData = await findUserPosts(Number(userId));
        setPosts(postsData);
      } catch (err) {
        handleError(err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleToggleFollow = async () => {
    try {
      if (isCurrentUserFollowingUser) {
        await unfollowUser(publicUser?.id!);
        setPublicUser((prev) =>
          prev
            ? {
                ...prev,
                followers: prev.followers?.filter(
                  (f) => f.id !== currentUser?.id,
                ),
              }
            : prev,
        );
      } else {
        const data = await followUser(publicUser?.id!);
        setPublicUser((prev) =>
          prev
            ? {
                ...prev,
                followers: [...prev.followers, data],
              }
            : prev,
        );
      }
    } catch (err) {
      handleError(err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="px-2">
      <PageTitle title={`${username}`} />

      <div className="flex items-center justify-center gap-4 mb-8">
        <div>
          <UserAvatar avatarUrl={publicUser?.avatarUrl} size={120} />
        </div>

        <div>
          <h3 className="font-bold text-2xl">
            {publicUser?.email.split("@")[0]}
          </h3>
          <div className="flex items-center gap-1.5 text-gray-400">
            <span>{posts.length} posts</span>
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
            onClick={handleToggleFollow}
            className={`px-4 py-1 text-sm rounded-full mt-2 flex items-center gap-2 ${
              isCurrentUserFollowingUser
                ? "text-gray-400 border border-gray-400 hover:bg-(--text-clr)/15"
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

      {posts.length ? (
        <PostsList posts={posts} showRemovePost={false} />
      ) : (
        <div className="text-center py-12">
          <h2 className="font-bold text-2xl mb-1">No posts found</h2>
          <p className="text-gray-400">
            This user hasn't created any posts yet.
          </p>
        </div>
      )}
    </section>
  );
};

export default PublicProfile;
