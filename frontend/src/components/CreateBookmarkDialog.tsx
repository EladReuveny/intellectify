import { useAtom } from "jotai";
import { SquarePen, Type, X } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";
import { createBookmark } from "../api/bookmarks.api";
import { bookmarksAtom } from "../store/bookmarks.atoms";
import { handleError } from "../utils/utils";
import Dialog from "./Dialog";

type CreateBookmarkDialogProps = {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
};

const CreateBookmarkDialog = ({ dialogRef }: CreateBookmarkDialogProps) => {
  const [_, setBookmarks] = useAtom(bookmarksAtom);

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const title = formData.get("title") as string;

    try {
      const data = await createBookmark({ title });
      setBookmarks((prev) => [...prev, data]);
      toast.success("Bookmark created successfully!");
      closeDialog();
      form.reset();
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <Dialog dialogRef={dialogRef} title="Create Bookmark">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="space-y-3">
          <div className="relative">
            <Type
              size={22}
              className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              id="title"
              name="title"
              placeholder=""
              required
              className="peer border border-gray-400 py-2 px-9 w-full rounded-md hover:border-(--text-clr) focus:border-(--text-clr) focus:shadow-[0_0_15px_var(--text-clr)]"
            />
            <label
              htmlFor="title"
              className="absolute top-1/2 left-9 -translate-y-1/2 
            peer-focus:text-xs peer-focus:top-0 peer-focus:left-4 peer-focus:bg-(--bg-clr) peer-focus:px-1
            peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs
            peer-[:not(:placeholder-shown)]:bg-(--bg-clr) peer-[:not(:placeholder-shown)]:px-1"
            >
              Title
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-5">
          <button
            type="reset"
            onClick={closeDialog}
            className="flex items-center gap-2 py-2 px-3 text-gray-400 border border-gray-400 rounded-md hover:bg-(--text-clr)/10"
          >
            <X size={24} /> Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 py-2 px-4 bg-(--text-clr) text-(--bg-clr) rounded-md hover:brightness-90"
          >
            <SquarePen size={24} /> Create
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default CreateBookmarkDialog;
