import { useAtom } from "jotai";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { findUserPosts } from "../api/users.api";
import PageTitle from "../components/PageTitle";
import PostsList from "../components/PostsList";
import { useAuth } from "../hooks/useAuth.hook";
import { postsAtom } from "../store/posts.atom";
import { handleError } from "../utils/utils";

type UserPostsProps = {};

const UserPosts = ({}: UserPostsProps) => {
  const [posts, setPosts] = useAtom(postsAtom);

  const { auth } = useAuth();
  const user = auth?.user;

  const { userId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      toast.info("Please sign in first to access your posts");
      return;
    }

    const fetchPostsByUserId = async () => {
      try {
        const data = await findUserPosts(Number(userId));
        setPosts(data);
      } catch (err) {
        handleError(err);
      }
    };

    fetchPostsByUserId();
  }, []);

  return (
    <section className="px-2">
      <PageTitle title="My Posts" />

      {posts.length === 0 ? (
        <div className="text-center">
          <h2 className="font-bold text-2xl mb-1">No posts found</h2>
          <p className="text-gray-400">Create a new post to get started.</p>
        </div>
      ) : (
        <PostsList posts={posts} showRemovePost={true} />
      )}
    </section>
  );
};

export default UserPosts;
