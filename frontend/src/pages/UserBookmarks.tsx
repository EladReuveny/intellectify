import { useAtom } from "jotai";
import { BookmarkPlus } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { findUserBookmarks } from "../api/users.api";
import BookmarksList from "../components/BookmarksList";
import CreateBookmarkDialog from "../components/CreateBookmarkDialog";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../hooks/useAuth.hook";
import { bookmarksAtom } from "../store/bookmarks.atoms";
import { handleError } from "../utils/utils";

type UserBookmarksProps = {};

const UserBookmarks = ({}: UserBookmarksProps) => {
  const [bookmarks, setBookmarks] = useAtom(bookmarksAtom);

  const { userId } = useParams();

  const { auth } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();

  const createBookmarkDialog = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      toast.info("Please sign in first to access your bookmarks");
      return;
    }

    const fetchUserBookmarkedPosts = async () => {
      try {
        const data = await findUserBookmarks(Number(userId));
        setBookmarks(data);
      } catch (err) {
        handleError(err);
      }
    };

    fetchUserBookmarkedPosts();
  }, []);

  const openCreateBookmarkDialog = () => {
    createBookmarkDialog.current?.showModal();
  };

  return (
    <section className="px-2">
      <PageTitle title="My Bookmarks" />

      {bookmarks.length === 0 && (
        <div className="text-center mb-2">
          <h2 className="font-bold text-2xl mb-1">No bookmarks found</h2>
          <p className="text-gray-400">
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

      <BookmarksList bookmarks={bookmarks} showRemoveBookmark={true} />

      <CreateBookmarkDialog dialogRef={createBookmarkDialog} />
    </section>
  );
};

export default UserBookmarks;
