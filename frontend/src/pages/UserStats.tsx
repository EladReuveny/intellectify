import {
  BookmarkCheck,
  ChartNoAxesCombined,
  Heart,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorFallback from "../components/ErrorFallback";
import PageTitle from "../components/PageTitle";
import Spinner from "../components/Spinner";
import type { StatsData } from "../components/StatsCard";
import StatsCardsList from "../components/StatsCardsList";
import UserAvatar from "../components/UserAvatar";
import { useGetUserStats } from "../features/users/users.queries";
import { useAuth } from "../hooks/useAuth.hook";
import { handleError } from "../utils/utils";

type UserStatsProps = {};

const UserStats = ({}: UserStatsProps) => {
  const { auth } = useAuth();
  const currentUserId = auth?.user.id;

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUserId) {
      navigate("/login");
      toast.info("Please sign in first to access your stats");
    }
  }, [currentUserId]);

  const [userQuery, postsQuery, likedPostsQuery, bookmarksQuery] =
    useGetUserStats(currentUserId!);

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = userQuery;

  const {
    data: posts,
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
  } = postsQuery;

  const {
    data: likedPosts,
    isLoading: isLikedPostsLoading,
    isError: isLikedPostsError,
    error: likedPostsError,
  } = likedPostsQuery;

  const {
    data: bookmarks,
    isLoading: isBookmarksLoading,
    isError: isBookmarksError,
    error: bookmarksError,
  } = bookmarksQuery;

  const isLoading =
    isUserLoading ||
    isPostsLoading ||
    isLikedPostsLoading ||
    isBookmarksLoading;
  if (isLoading) {
    return <Spinner />;
  }

  const isError =
    isPostsError || isLikedPostsError || isBookmarksError || isUserError;
  if (isError) {
    const error = userError || postsError || likedPostsError || bookmarksError;
    handleError(error);
    return <ErrorFallback error={error!} />;
  }

  let totalComments = 0;
  posts?.forEach((post) => (totalComments += post.comments?.length ?? 0));

  const statsCards: StatsData[] = [
    {
      id: 1,
      title: "Created Posts",
      value: posts?.length ?? 0,
      icon: <TrendingUp />,
      bgColor: "bg-green-500/10",
      textColor: "text-green-500",
    },
    {
      id: 2,
      title: "Liked Posts",
      value: likedPosts?.length ?? 0,
      icon: <Heart />,
      bgColor: "bg-red-500/10",
      textColor: "text-red-500",
    },
    {
      id: 3,
      title: "Total Comments",
      value: totalComments,
      icon: <MessageSquare />,
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500",
    },
    {
      id: 4,
      title: "Followers",
      value: user?.followers?.length || 0,
      icon: <Users />,
      bgColor: "bg-cyan-500/10",
      textColor: "text-cyan-500",
    },
    {
      id: 5,
      title: "Following",
      value: user?.following?.length || 0,
      icon: <Users />,
      bgColor: "bg-cyan-500/10",
      textColor: "text-cyan-500",
    },
    {
      id: 6,
      title: "Bookmarks",
      value: bookmarks?.length ?? 0,
      icon: <BookmarkCheck />,
      bgColor: "bg-yellow-500/10",
      textColor: "text-yellow-500",
    },
  ];

  return (
    <section className="px-2">
      <PageTitle title="Stats" />

      <p className="text-gray-400">
        Track your activity and engagement across the platform
      </p>

      <div className="flex items-center gap-4 mt-5 bg-(--text-clr)/15 p-4 rounded-lg shadow-lg hover:bg-(--text-clr)/25">
        <div>
          <UserAvatar avatarUrl={user?.avatarUrl} size={48} />
        </div>

        <div>
          <h2 className="text-2xl font-bold">{user?.email}</h2>

          <p className="text-gray-400">
            Member since{" "}
            {user?.createdAt &&
              new Date(user?.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
          </p>
        </div>
      </div>

      <div className="mt-5 bg-(--text-clr)/15 p-4 rounded-lg shadow-lg hover:bg-(--text-clr)/25">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
          <span className="text-purple-500">
            <ChartNoAxesCombined />
          </span>
          Stats Overview
        </h2>

        <StatsCardsList statsCards={statsCards} />
      </div>

      <div className="mt-5 bg-(--text-clr)/15 p-4 rounded-lg shadow-lg hover:bg-(--text-clr)/25">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="text-blue-500">
            <TrendingUp />
          </span>
          Recent Posts
        </h2>

        <div className="space-y-3 mt-3">
          {posts?.length ? (
            posts?.slice(0, 5).map((post) => (
              <Link
                to={`/posts/${post.id}`}
                key={post.id}
                className="p-3 rounded-md block bg-(--text-clr)/20 hover:bg-(--text-clr)/30"
              >
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {post.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {post.comments?.length || 0} comments
                </p>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              You haven't created any posts yet
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 bg-(--text-clr)/15 p-4 rounded-lg shadow-lg hover:bg-(--text-clr)/25">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="text-amber-500">
            <BookmarkCheck />
          </span>
          Bookmarks
        </h2>

        <div className="space-y-3 mt-3">
          {bookmarks?.length ? (
            bookmarks?.map((bookmark) => (
              <Link
                to={`/users/${user?.id}/bookmarks/${bookmark.id}`}
                key={bookmark.id}
                className="p-3 rounded-md block bg-(--text-clr)/20 hover:bg-(--text-clr)/30"
              >
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {bookmark.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Last updated at{" "}
                  {new Date(bookmark.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              You haven't created any bookmarks yet
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserStats;
