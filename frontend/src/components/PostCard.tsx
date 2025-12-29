import { useAtom } from "jotai";
import {
  BookmarkMinus,
  BookmarkPlus,
  Calendar,
  CircleEllipsis,
  ThumbsUp,
  Trash,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { removePostFromBookmark } from "../api/bookmarks.api";
import { removePost } from "../api/posts.api";
import {
  bookmarkAtom,
  postIdToAddToBookmarkAtom,
} from "../store/bookmarks.atoms";
import { postsAtom } from "../store/posts.atom";
import type { Post } from "../types/post.types";
import { handleError } from "../utils/utils";
import AddPostToBookmarkDialog from "./AddPostToBookmarkDialog";
import ConfirmationDialog from "./ConfirmationDialog";

type PostCardProps = {
  post: Post;
  index: number;
  showRemoveFromCurrentBookmark?: boolean;
  showRemovePost?: boolean;
};

const PostCard = ({
  post,
  index,
  showRemoveFromCurrentBookmark = false,
  showRemovePost = false,
}: PostCardProps) => {
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const [bookmark, setBookmark] = useAtom(bookmarkAtom);
  const [, setPosts] = useAtom(postsAtom);
  const [, setPostIdToAddToBookmark] = useAtom(postIdToAddToBookmarkAtom);

  const moreOptionsRef = useRef<HTMLDivElement | null>(null);
  const addToBookmarkDialogRef = useRef<HTMLDialogElement | null>(null);
  const removePostDialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const handleOutSideClick = (e: MouseEvent) => {
      if (
        isMoreOptionsOpen &&
        !moreOptionsRef.current?.contains(e.target as Node)
      ) {
        setIsMoreOptionsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMoreOptionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutSideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutSideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMoreOptionsOpen]);

  const toggleMoreOptions = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMoreOptionsOpen((prev) => !prev);
  };

  const openAddPostToBookmarkDialog = () => {
    setPostIdToAddToBookmark(post.id);
    addToBookmarkDialogRef.current?.showModal();
  };

  const handleRemovePostFromBookmark = async () => {
    if (!bookmark) {
      return;
    }

    try {
      const data = await removePostFromBookmark(bookmark.id, post.id);
      setBookmark(data);
      toast.success("Post removed from bookmark successfully");
    } catch (err) {
      handleError(err);
    }
  };

  const handleRemovePost = async () => {
    try {
      await removePost(post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      toast.success("Post removed successfully");
    } catch (err) {
      handleError(err);
    }
  };

  const openRemovePostDialog = () => {
    removePostDialogRef.current?.showModal();
  };

  return (
    <>
      <Link
        to={`/posts/${post.id}`}
        key={post.id}
        className="relative rounded-md border border-gray-400 shadow-lg flex flex-col md:flex-row items-center gap-4 p-2 hover:bg-(--text-clr)/15"
      >
        <span className="text-xs text-gray-400">{index + 1}</span>

        <img
          src={post.imageUrl || undefined}
          alt={`${post.title}'s image`}
          className="w-full md:w-64 object-contain rounded-md"
        />

        <div className="w-full">
          <h2 className="text-2xl font-bold">{post.title}</h2>
          <p className="text-gray-400">{post.content?.slice(0, 100)}...</p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                title="Created at"
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-(--text-clr)"
              >
                <Calendar size={20} />{" "}
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div
                title={`${post?.likes?.length} Likes`}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-(--text-clr)"
              >
                <ThumbsUp size={20} /> {post?.likes?.length}
              </div>
            </div>

            <div
              title="More"
              onClick={(e) => toggleMoreOptions(e)}
              className="relative text-sm text-gray-400 hover:text-(--text-clr)"
            >
              <CircleEllipsis size={24} />

              {isMoreOptionsOpen && (
                <div
                  ref={moreOptionsRef}
                  className="absolute top-full right-0 z-1 flex flex-col whitespace-nowrap bg-gray-500 rounded-md shadow-md"
                >
                  <button
                    type="button"
                    title="Add to Bookmark"
                    className="flex items-center gap-2 text-(--text-clr) rounded-md p-2 hover:bg-(--text-clr)/20"
                    onClick={openAddPostToBookmarkDialog}
                  >
                    <BookmarkPlus size={24} />
                    Add to Bookmark
                  </button>
                  {showRemoveFromCurrentBookmark && (
                    <button
                      type="button"
                      title="Remove from current Bookmark"
                      className="flex items-center gap-2 text-(--text-clr) rounded-md p-2 hover:bg-(--text-clr)/20"
                      onClick={handleRemovePostFromBookmark}
                    >
                      <BookmarkMinus size={24} />
                      Remove from current Bookmark
                    </button>
                  )}
                  {showRemovePost && (
                    <button
                      type="button"
                      title="Remove Post"
                      className="flex items-center gap-2 text-(--text-clr) rounded-md p-2 hover:bg-(--text-clr)/20"
                      onClick={openRemovePostDialog}
                    >
                      <Trash size={24} />
                      Remove Post
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      <AddPostToBookmarkDialog dialogRef={addToBookmarkDialogRef} />

      <ConfirmationDialog
        dialogRef={removePostDialogRef}
        onAction={handleRemovePost}
        title="Remove Post"
        description="Are you sure you want to remove this post?"
        icon={<Trash size={32} />}
      />
    </>
  );
};

export default PostCard;
