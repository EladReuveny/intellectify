import { FileText, Image, SquarePen, Type, X } from "lucide-react";
import { useState, type RefObject } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreatePost } from "../features/posts/posts.mutations";
import { useAuth } from "../hooks/useAuth.hook";
import type { Post } from "../types/post.types";
import ContentEditor from "./ContentEditor";
import Dialog from "./Dialog";

type CreatePostDialogProps = {
  dialogRef: RefObject<HTMLDialogElement | null>;
};

const CreatePostDialog = ({ dialogRef }: CreatePostDialogProps) => {
  const { auth } = useAuth();
  const user = auth?.user;

  const [content, setContent] = useState("");

  const navigate = useNavigate();

  const closeDialogRef = () => {
    dialogRef.current?.close();
  };

  const { mutate: createPostMutation } = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const title = formData.get("title") as string;
    const imageUrl = formData.get("imageUrl") as string;

    const doc = new DOMParser().parseFromString(content, "text/html");
    const plainTextContent = doc.body.textContent || "";

    createPostMutation(
      {
        title,
        content: plainTextContent,
        imageUrl,
        authorId: user?.id!,
      },
      {
        onSuccess: (data: Post) => {
          toast.success("Post created successfully!");
          navigate(`/posts/${data.id}`);
          form.reset();
          setContent("");
        },
        onSettled: () => {
          closeDialogRef();
        },
      },
    );
  };

  return (
    <Dialog dialogRef={dialogRef} title="Create Post">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="space-y-3">
          <div className="relative">
            <Type
              size={22}
              className="absolute top-1/2 left-2 -translate-y-1/2 text-(--text-clr)/60"
            />
            <input
              type="text"
              id="title"
              name="title"
              placeholder=""
              required
              className="peer border border-(--text-clr)/60 py-2 px-9 w-full rounded-md hover:border-(--text-clr) focus:border-(--text-clr) focus:shadow-[0_0_15px_var(--text-clr)]"
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

          <div>
            <div className="flex items-center gap-2">
              <FileText size={22} className="text-(--text-clr)/60" />
              <label htmlFor="content">Content</label>
            </div>

            <ContentEditor value={content} onChange={setContent} />
          </div>

          <div className="relative">
            <Image
              size={22}
              className="absolute top-1/2 left-2 -translate-y-1/2 text-(--text-clr)/60"
            />
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              placeholder=""
              className="peer border border-(--text-clr)/60 py-2 px-9 w-full rounded-md hover:border-(--text-clr) focus:border-(--text-clr) focus:shadow-[0_0_15px_var(--text-clr)]"
            />
            <label
              htmlFor="imageUrl"
              className="absolute top-1/2 left-9 -translate-y-1/2 
            peer-focus:text-xs peer-focus:top-0 peer-focus:left-4 peer-focus:bg-(--bg-clr) peer-focus:px-1
            peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs
            peer-[:not(:placeholder-shown)]:bg-(--bg-clr) peer-[:not(:placeholder-shown)]:px-1"
            >
              Image Url *
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-5">
          <button
            type="reset"
            onClick={() => {
              setContent("");
              closeDialogRef();
            }}
            className="flex items-center gap-2 py-2 px-3 text-(--text-clr)/60 border border-(--text-clr)/60 rounded-md hover:bg-(--text-clr)/15"
          >
            <X size={24} /> Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 py-2 px-4 bg-(--text-clr) text-(--bg-clr) rounded-md hover:brightness-90"
          >
            <SquarePen size={24} /> Post
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default CreatePostDialog;
