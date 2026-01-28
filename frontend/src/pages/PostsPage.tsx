import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { findAllPosts } from "../api/posts.api";
import PageTitle from "../components/PageTitle";
import Pagination from "../components/Pagination";
import PostsList from "../components/PostsList";
import type { Post } from "../types/post.types";
import type { PaginationResponseMeta } from "../types/posts-query.types";
import { handleError } from "../utils/utils";

type PostsPageProps = {};

const PostsPage = ({}: PostsPageProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationResponseMeta | null>(
    null,
  );

  const [searchParams] = useSearchParams();

  const q = searchParams.get("q") ?? undefined;
  const page = searchParams.get("page") ?? undefined;
  const limit = searchParams.get("limit") ?? undefined;
  const sortBy = searchParams.get("sortBy") ?? undefined;
  const order = searchParams.get("order") ?? undefined;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await findAllPosts({
          q: q ? q.trim() : undefined,
          page: page ? Number(page) : undefined,
          limit: limit ? Number(limit) : undefined,
          sortBy: sortBy as "title" | "createdAt" | "likes" | "comments",
          order: order as "asc" | "desc",
        });
        setPosts(data.items);
        setPagination(data.meta);
      } catch (err) {
        handleError(err);
      }
    };

    fetchPosts();
  }, [searchParams]);

  return (
    <section className="px-2">
      <PageTitle title="Posts" />

      <PostsList posts={posts} />

      <div className="mt-8">
        {pagination && <Pagination pagination={pagination} />}
      </div>
    </section>
  );
};

export default PostsPage;
