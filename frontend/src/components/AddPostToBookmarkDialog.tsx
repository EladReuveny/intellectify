import { BookmarkPlus, Folder } from "lucide-react";
import { useRef, type RefObject } from "react";
import { useFindUserBookmarks } from "../features/users/users.queries";
import { useAuth } from "../hooks/useAuth.hook";
import { handleError } from "../utils/utils";
import BookmarksList from "./BookmarksList";
import CreateBookmarkDialog from "./CreateBookmarkDialog";
import Dialog from "./Dialog";
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

  const {
    data: bookmarks,
    isLoading,
    isError,
    error,
  } = useFindUserBookmarks(user?.id!, {
    enabled: !!user?.id && !!dialogRef.current?.open,
  });

  const openCreateBookmarkDialog = () => {
    createBookmarkDialog.current?.showModal();
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    dialogRef.current?.close();
    handleError(error);
    return;
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
            <Folder size={48} className="text-(--text-clr)/60" />
          </div>
          <div>
            <h2 className="font-bold text-xl">No Playlists Found</h2>
            <p className="text-(--text-clr)/60 text-sm">
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
