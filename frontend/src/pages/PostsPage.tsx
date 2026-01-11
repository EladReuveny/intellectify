import { useEffect, useState } from "react";
import { findAllPosts } from "../api/posts.api";
import PageTitle from "../components/PageTitle";
import PostsList from "../components/PostsList";
import type { Post } from "../types/post.types";
import { handleError } from "../utils/utils";

type PostsPageProps = {};

const PostsPage = ({}: PostsPageProps) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await findAllPosts();
        setPosts(data);
      } catch (err) {
        handleError(err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="px-2">
      <PageTitle title="Posts" />

      <PostsList posts={posts} />
    </section>
  );
};

export default PostsPage;
