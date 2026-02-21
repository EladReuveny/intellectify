import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorFallback from "../components/ErrorFallback";
import PageTitle from "../components/PageTitle";
import PostsList from "../components/PostsList";
import Spinner from "../components/Spinner";
import { useFindUserLikedPosts } from "../features/users/users.queries";
import { useAuth } from "../hooks/useAuth.hook";
import { handleError } from "../utils/utils";

type LikedPostsProps = {};

const LikedPosts = ({}: LikedPostsProps) => {
  const { auth } = useAuth();
  const loggedInUserId = auth?.user?.id;

  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUserId) {
      navigate("/login");
      toast.info("Please sign in first to access your profile");
      return;
    }
  }, []);

  const {
    data: likes,
    isLoading,
    isError,
    error,
  } = useFindUserLikedPosts(loggedInUserId!);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    handleError(error);
    return <ErrorFallback error={error} />;
  }

  return (
    <section className="px-2">
      <PageTitle title="Liked Posts" />

      {likes?.length === 0 ? (
        <div className="text-center">
          <h2 className="font-bold text-2xl mb-1">Empty liked post list</h2>
          <p className="text-gray-400">You have not liked any posts yet.</p>
        </div>
      ) : (
        <PostsList posts={likes?.map((like) => like.post) ?? []} />
      )}
    </section>
  );
};

export default LikedPosts;
