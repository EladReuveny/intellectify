import { BookmarkPlus } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BookmarksList from "../components/BookmarksList";
import CreateBookmarkDialog from "../components/CreateBookmarkDialog";
import ErrorFallback from "../components/ErrorFallback";
import PageTitle from "../components/PageTitle";
import Spinner from "../components/Spinner";
import { useFindUserBookmarks } from "../features/users/users.queries";
import { useAuth } from "../hooks/useAuth.hook";
import { handleError } from "../utils/utils";

type UserBookmarksProps = {};

const UserBookmarks = ({}: UserBookmarksProps) => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { auth } = useAuth();
  const user = auth?.user;

  const createBookmarkDialog = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      toast.info("Please sign in first to access your bookmarks");
      return;
    }
  }, []);

  const {
    data: bookmarks,
    isLoading,
    isError,
    error,
  } = useFindUserBookmarks(Number(userId));

  const openCreateBookmarkDialog = () => {
    createBookmarkDialog.current?.showModal();
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    handleError(error);
    return <ErrorFallback error={error} />;
  }

  return (
    <section className="px-2">
      <PageTitle title="My Bookmarks" />

      {bookmarks?.length === 0 && (
        <div className="text-center mb-2">
          <h2 className="font-bold text-2xl mb-1">No bookmarks found</h2>
          <p className="text-(--text-clr)/60">
            Create a new bookmark and adding posts.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={openCreateBookmarkDialog}
        className="flex items-center gap-2 mb-4 py-2 px-3 bg-(--text-clr) text-(--bg-clr) rounded hover:brightness-90"
      >
        <BookmarkPlus />
        Create Bookmark
      </button>

      {bookmarks && (
        <BookmarksList bookmarks={bookmarks} showRemoveBookmark={true} />
      )}

      <CreateBookmarkDialog dialogRef={createBookmarkDialog} />
    </section>
  );
};

export default UserBookmarks;
