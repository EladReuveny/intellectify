import type { Bookmark } from "../types/bookmark.types";
import BookmarkCard from "./BookmarkCard";

type BookmarksListProps = {
  bookmarks: Bookmark[];
  dialogRef?: React.RefObject<HTMLDialogElement | null>;
  showRemoveBookmark?: boolean;
};

const BookmarksList = ({
  bookmarks,
  dialogRef,
  showRemoveBookmark = false,
}: BookmarksListProps) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          dialogRef={dialogRef}
          showRemoveBookmark={showRemoveBookmark}
        />
      ))}
    </div>
  );
};

export default BookmarksList;
