import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useFindBookmark } from "../features/bookmarks/bookmarks.queries";
import { useAuth } from "../hooks/useAuth.hook";
import { handleError } from "../utils/utils";
import ErrorFallback from "./ErrorFallback";
import PageTitle from "./PageTitle";
import PostsList from "./PostsList";
import Spinner from "./Spinner";

type BookmarkDetailsProps = {};

const BookmarkDetails = ({}: BookmarkDetailsProps) => {
  const { bookmarkId } = useParams();

  const { auth } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      toast.info("Please sign in first to access bookmark details");
      return;
    }
  }, []);

  const {
    data: bookmark,
    isLoading,
    isError,
    error,
  } = useFindBookmark(Number(bookmarkId));

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    handleError(error);
    return <ErrorFallback error={error} />;
  }

  return (
    <section className="px-2">
      <PageTitle title={bookmark?.title ?? "Bookmark Details"} />

      {bookmark?.posts?.length === 0 ? (
        <div className="text-center">
          <h2 className="font-bold text-2xl mb-1">No posts found</h2>
          <p className="text-(--text-clr)/60">
            Add posts to this bookmark to see them here.
          </p>
        </div>
      ) : (
        <PostsList
          posts={bookmark?.posts ?? []}
          currentBookmarkId={bookmark?.id}
          showRemoveFromCurrentBookmark={true}
        />
      )}
    </section>
  );
};

export default BookmarkDetails;
