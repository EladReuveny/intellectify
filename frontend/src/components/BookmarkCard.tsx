import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Folder, Trash } from "lucide-react"; 
import type React from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useAddPostToBookmark,
  useRemoveBookmark,
} from "../features/bookmarks/bookmarks.mutations";
import { usersKeys } from "../features/users/users.keys";
import { postIdToAddToBookmarkAtom } from "../store/bookmarks.atoms";
import type { Bookmark } from "../types/bookmark.types";

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
    (post) => post.imageUrl,
  )?.imageUrl;

  const [postIdToAddToBookmark, setPostIdToAddToBookmark] = useAtom(
    postIdToAddToBookmarkAtom,
  );

  const queryClient = useQueryClient();

  const { mutate: addPostToBookmarkMutation } = useAddPostToBookmark();

  const { mutate: removeBookmarkMutation } = useRemoveBookmark();

  const handleAddPostToBookmark = async (
    e: React.MouseEvent,
    bookmarkId: number,
  ) => {
    if (postIdToAddToBookmark) {
      e.preventDefault();

      addPostToBookmarkMutation(
        {
          bookmarkId,
          postId: postIdToAddToBookmark,
        },
        {
          onSuccess: () => {
            toast.success("Post saved to bookmark successfully");
          },
          onSettled: () => {
            dialogRef?.current?.close();
            setPostIdToAddToBookmark(null);
          },
        },
      );
    }
  };

  const handleRemoveBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();

    removeBookmarkMutation(bookmark.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: usersKeys.bookmarks(Number(userId)),
        });
      },
    });
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
