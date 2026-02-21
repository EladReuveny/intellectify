import { BookmarkPlus, Folder } from "lucide-react";
import { useEffect, useRef, type RefObject } from "react";
import { toast } from "react-toastify";
import { useFindUserBookmarks } from "../features/users/users.queries";
import { useAuth } from "../hooks/useAuth.hook";
import { handleError } from "../utils/utils";
import BookmarksList from "./BookmarksList";
import CreateBookmarkDialog from "./CreateBookmarkDialog";
import Dialog from "./Dialog";
import ErrorFallback from "./ErrorFallback";
import Spinner from "./Spinner";

type AddPostToBookmarkDialogProps = {
  dialogRef: RefObject<HTMLDialogElement | null>;
};

const AddPostToBookmarkDialog = ({
  dialogRef,
}: AddPostToBookmarkDialogProps) => {
  const { auth } = useAuth();
  const user = auth?.user;

  const createBookmarkDialog = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!user && dialogRef?.current?.open) {
      toast.info("Please sign in first to access your bookmarks");
      return;
    }
  }, []);

  const {
    data: bookmarks,
    isLoading,
    isError,
    error,
  } = useFindUserBookmarks(user?.id!);

  const openCreateBookmarkDialog = () => {
    createBookmarkDialog.current?.showModal();
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    dialogRef.current?.close();
    handleError(error);
    return <ErrorFallback error={error} />;
  }

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

      {bookmarks?.length ? (
        <BookmarksList bookmarks={bookmarks} dialogRef={dialogRef} />
      ) : (
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
      )}

      <CreateBookmarkDialog dialogRef={createBookmarkDialog} />
    </Dialog>
  );
};

export default AddPostToBookmarkDialog;
