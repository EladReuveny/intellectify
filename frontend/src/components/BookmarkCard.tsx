import { useAtom } from "jotai";
import { Folder, Trash } from "lucide-react"; // Optional icon for empty states
import type React from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { addPostToBookmark, removeBookmark } from "../api/bookmarks.api";
import {
  bookmarksAtom,
  postIdToAddToBookmarkAtom,
} from "../store/bookmarks.atoms";
import type { Bookmark } from "../types/bookmark.types";
import { handleError } from "../utils/utils";

type BookmarkCardProps = {
  bookmark: Bookmark;
  dialogRef?: React.RefObject<HTMLDialogElement | null>;
  showRemoveBookmark?: boolean;
};

const BookmarkCard = ({
  bookmark,
  dialogRef,
  showRemoveBookmark = false,
}: BookmarkCardProps) => {
  const { userId } = useParams();
  const postsCount = bookmark.posts?.length || 0;
  const firstPostImage = bookmark?.posts?.find(
    (post) => post.imageUrl
  )?.imageUrl;
  const [postIdToAddToBookmark, setPostIdToAddToBookmark] = useAtom(
    postIdToAddToBookmarkAtom
  );
  const [, setBookmarks] = useAtom(bookmarksAtom);

  const handleAddPostToBookmark = async (
    e: React.MouseEvent,
    bookmarkId: number
  ) => {
    if (postIdToAddToBookmark) {
      e.preventDefault();

      try {
        await addPostToBookmark(bookmarkId, postIdToAddToBookmark);
        toast.success("Post saved to bookmark successfully");
      } catch (err) {
        handleError(err);
      } finally {
        dialogRef?.current?.close();
        setPostIdToAddToBookmark(null);
      }
    }
  };

  const handleRemoveBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      await removeBookmark(bookmark.id);
      setBookmarks((prev) => prev.filter((b) => b.id !== bookmark.id));
      toast.success("Bookmark deleted successfully");
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <Link
      to={`/users/${userId}/bookmarks/${bookmark.id}`}
      className="flex flex-col gap-3 rounded-xl bg-(--text-clr)/5 border border-(--text-clr)/25 shadow-xl overflow-hidden hover:bg-(--text-clr)/15 hover:border-(--text-clr)/50"
      onClick={(e) => handleAddPostToBookmark(e, bookmark.id)}
    >
      <div className="relative aspect-square rounded-lg bg-(--text-clr)/5 flex items-center justify-center">
        {postsCount > 0 && firstPostImage ? (
          <img
            src={firstPostImage}
            alt={bookmark.title}
            className="w-full h-full object-fill"
          />
        ) : (
          <Folder size={40} className="opacity-35" />
        )}

        <span className="absolute bottom-0.5 left-0.5 py-1 px-2 text-[12px] font-bold tracking-wider bg-(--bg-clr) rounded">
          {postsCount} {postsCount === 1 ? "post" : "posts"}
        </span>
      </div>

      <div className="px-2 pb-4">
        <h2 className="font-semibold text-lg mb-1">{bookmark.title}</h2>

        <div className="text-gray-400 text-xs flex items-center justify-between">
          <div className="text-gray-400 text-xs flex items-center gap-1">
            <span>
              {new Date(bookmark.updatedAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span>•</span>
            <span className="italic">Last updated</span>
          </div>

          {showRemoveBookmark && (
            <button
              type="button"
              title="Remove bookmark"
              onClick={(e) => handleRemoveBookmark(e)}
              className="text-red-500 hover:scale-110"
            >
              <Trash size={22} />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BookmarkCard;
