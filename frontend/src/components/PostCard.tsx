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
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useRemovePostFromBookmark } from "../features/bookmarks/bookmarks.mutations";
import { useRemovePost } from "../features/posts/posts.mutations";
import { useAuth } from "../hooks/useAuth.hook";
import { postIdToAddToBookmarkAtom } from "../store/bookmarks.atoms";
import type { Post } from "../types/post.types";
import AddPostToBookmarkDialog from "./AddPostToBookmarkDialog";
import ConfirmationDialog from "./ConfirmationDialog";

type PostCardProps = {
  post: Post;
  index: number;
  currentBookmarkId?: number;
  showRemoveFromCurrentBookmark?: boolean;
  showRemovePost?: boolean;
};

const PostCard = ({
  post,
  index,
  currentBookmarkId,
  showRemoveFromCurrentBookmark = false,
  showRemovePost = false,
}: PostCardProps) => {
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const [, setPostIdToAddToBookmark] = useAtom(postIdToAddToBookmarkAtom);

  const moreOptionsRef = useRef<HTMLDivElement | null>(null);
  const addToBookmarkDialogRef = useRef<HTMLDialogElement | null>(null);
  const removePostDialogRef = useRef<HTMLDialogElement | null>(null);

  const { auth } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();

  const { mutate: removePostFromBookmarkMutation } =
    useRemovePostFromBookmark();

  const { mutate: removePostMutation } = useRemovePost();

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
    if (!user) {
      navigate("/login");
      toast.info("Please sign in first to access your bookmarks");
      return;
    }

    setPostIdToAddToBookmark(post.id);
    addToBookmarkDialogRef.current?.showModal();
  };

  const openRemovePostDialog = () => {
    removePostDialogRef.current?.showModal();
  };

  const handleRemovePostFromBookmark = async () => {
    if (!currentBookmarkId) {
      return;
    }

    removePostFromBookmarkMutation(
      { bookmarkId: currentBookmarkId, postId: post.id },
      {
        onSuccess: () =>
          toast.success("Post removed from bookmark successfully"),
      },
    );
  };

  return (
    <>
      <Link
        to={`/posts/${post.id}`}
        key={post.id}
        className="relative group rounded-lg border border-(--text-clr)/35 shadow-lg px-2 flex flex-col md:flex-row gap-4 hover:bg-(--text-clr)/15"
      >
        <span className="text-xs text-(--text-clr)/60 self-center">
          {index + 1}
        </span>

        <img
          src={post.imageUrl || undefined}
          alt={`${post.title}'s image`}
          className="w-full md:w-64 aspect-video rounded-lg group-hover:scale-105"
        />

        <div className="w-full flex flex-col justify-between py-2">
          <h2 className="text-2xl font-bold">{post.title}</h2>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                title="Created at"
                className="flex items-center gap-1 text-sm text-(--text-clr)/60"
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
                className="flex items-center gap-1 text-sm text-(--text-clr)/60"
              >
                <ThumbsUp size={20} /> {post?.likes?.length}
              </div>
            </div>

            <div
              title="More"
              onClick={(e) => toggleMoreOptions(e)}
              className="relative text-sm text-(--text-clr)/60 hover:text-(--text-clr)"
            >
              <CircleEllipsis size={24} />

              {isMoreOptionsOpen && (
                <div
                  ref={moreOptionsRef}
                  className="absolute top-full right-0 z-100 flex flex-col whitespace-nowrap bg-(--text-clr) text-(--bg-clr) rounded-lg shadow-md"
                >
                  <button
                    type="button"
                    title="Add to Bookmark"
                    className="flex items-center gap-2 rounded-lg p-2 hover:backdrop-brightness-90"
                    onClick={openAddPostToBookmarkDialog}
                  >
                    <BookmarkPlus size={24} />
                    Add to Bookmark
                  </button>
                  {showRemoveFromCurrentBookmark && (
                    <button
                      type="button"
                      title="Remove from current Bookmark"
                      className="flex items-center gap-2 rounded-lg p-2 hover:backdrop-brightness-90"
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
                      className="flex items-center gap-2 text-(--text-clr) rounded-lg p-2 hover:bg-(--text-clr)/20"
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
        onAction={() => removePostMutation(post.id)}
        title="Remove Post"
        description="Are you sure you want to remove this post?"
        icon={<Trash size={32} />}
      />
    </>
  );
};

export default PostCard;
