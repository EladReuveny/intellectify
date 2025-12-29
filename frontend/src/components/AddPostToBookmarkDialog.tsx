import { useAtom } from "jotai";
import { BookmarkPlus, Folder } from "lucide-react";
import { useEffect, useRef, type RefObject } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { findUserBookmarks } from "../api/users.api";
import { useAuth } from "../hooks/useAuth.hook";
import { bookmarksAtom } from "../store/bookmarks.atoms";
import { handleError } from "../utils/utils";
import BookmarksList from "./BookmarksList";
import CreateBookmarkDialog from "./CreateBookmarkDialog";
import Dialog from "./Dialog";

type AddPostToBookmarkDialogProps = {
  dialogRef: RefObject<HTMLDialogElement | null>;
};

const AddPostToBookmarkDialog = ({
  dialogRef,
}: AddPostToBookmarkDialogProps) => {
  const [bookmarks, setBookmarks] = useAtom(bookmarksAtom);

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

    const fetchUserBookmarks = async () => {
      try {
        const data = await findUserBookmarks(Number(user?.id));
        setBookmarks(data);
      } catch (err) {
        dialogRef.current?.close();
        handleError(err);
      }
    };

    fetchUserBookmarks();
  }, []);

  const openCreateBookmarkDialog = () => {
    createBookmarkDialog.current?.showModal();
  };

  return (
    <Dialog dialogRef={dialogRef} title="Add to Bookmark">
      <button
        type="button"
        onClick={openCreateBookmarkDialog}
        className="flex items-center gap-2 mb-4 py-2 px-3 bg-(--text-clr) text-(--bg-clr) rounded hover:brightness-90"
      >
        <BookmarkPlus />
        Create Bookmark
      </button>

      {bookmarks.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center gap-4">
          <div className="p-4 bg-(--text-clr)/10 rounded-full">
            <Folder size={48} className="text-gray-400" />
          </div>
          <div>
            <h2 className="font-bold text-xl">No Playlists Found</h2>
            <p className="text-gray-400 text-sm">
              Create a new bookmark to get started.
            </p>
          </div>
        </div>
      ) : (
        <BookmarksList bookmarks={bookmarks} dialogRef={dialogRef} />
      )}

      <CreateBookmarkDialog dialogRef={createBookmarkDialog} />
    </Dialog>
  );
};

export default AddPostToBookmarkDialog;
