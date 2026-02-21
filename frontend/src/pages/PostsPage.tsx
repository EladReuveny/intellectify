import { useSearchParams } from "react-router-dom";
import ErrorFallback from "../components/ErrorFallback";
import PageTitle from "../components/PageTitle";
import Pagination from "../components/Pagination";
import PostsList from "../components/PostsList";
import Spinner from "../components/Spinner";
import { useFindAllPosts } from "../features/posts/posts.queries";
import type { Post } from "../types/post.types";
import type { PaginationResponseMeta } from "../types/posts-query.types";
import { handleError } from "../utils/utils";

type PostsPageProps = {};

const PostsPage = ({}: PostsPageProps) => {
  const [searchParams] = useSearchParams();

  const q = searchParams.get("q") ?? undefined;
  const page = searchParams.get("page") ?? undefined;
  const limit = searchParams.get("limit") ?? undefined;
  const sortBy = searchParams.get("sortBy") ?? undefined;
  const order = searchParams.get("order") ?? undefined;

  const { data, isLoading, isError, error } = useFindAllPosts({
    q: q?.trim(),
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    sortBy: sortBy as "title" | "createdAt" | "likes" | "comments",
    order: order as "asc" | "desc",
  });

  const posts: Post[] = data?.items ?? [];
  const pagination: PaginationResponseMeta | null = data?.meta ?? null;

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    handleError(error);
    return <ErrorFallback error={error} />;
  }

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
