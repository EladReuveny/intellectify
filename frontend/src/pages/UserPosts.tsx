import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorFallback from "../components/ErrorFallback";
import PageTitle from "../components/PageTitle";
import PostsList from "../components/PostsList";
import Spinner from "../components/Spinner";
import { useFindUserPosts } from "../features/users/users.queries";
import { useAuth } from "../hooks/useAuth.hook";
import { handleError } from "../utils/utils";

type UserPostsProps = {};

const UserPosts = ({}: UserPostsProps) => {
  const { auth } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      toast.info("Please sign in first to access your posts");
      return;
    }
  }, []);

  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useFindUserPosts(user?.id!);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    handleError(error);
    return <ErrorFallback error={error} />;
  }

  return (
    <section className="px-2">
      <PageTitle title="My Posts" />

      {posts?.length ? (
        <PostsList posts={posts} showRemovePost={true} />
      ) : (
        <div className="text-center">
          <h2 className="font-bold text-2xl mb-1">No posts found</h2>
          <p className="text-gray-400">Create a new post to get started.</p>
        </div>
      )}
    </section>
  );
};

export default UserPosts;
