import { useForm } from "@tanstack/react-form";
import { FileText, Image, SquarePen, Type, X } from "lucide-react";
import { useState, type RefObject } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import z from "zod";
import { useCreatePost } from "../features/posts/posts.mutations";
import { useAuth } from "../hooks/useAuth.hook";
import type { Post } from "../types/post.types";
import ContentEditor from "./ContentEditor";
import Dialog from "./Dialog";
import FormInputField from "./FormInputField";

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  imageUrl: z.url("Invalid image URL"),
});

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

  const form = useForm({
    defaultValues: {
      title: "",
      imageUrl: "",
    },
    validators: {
      onChange: createPostSchema,
      onSubmit: createPostSchema,
    },
    onSubmit: async ({ value }) => {
      const doc = new DOMParser().parseFromString(content, "text/html");
      const plainTextContent = doc.body.textContent || "";

      createPostMutation(
        {
          title: value.title,
          content: plainTextContent,
          imageUrl: value.imageUrl,
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
    },
  });

  return (
    <Dialog dialogRef={dialogRef} title="Create Post">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="space-y-3">
          <form.Field name="title">
            {(field) => (
              <FormInputField
                field={field}
                type="text"
                label="Title"
                Icon={Type}
              />
            )}
          </form.Field>

          <div>
            <div className="flex items-center gap-2">
              <FileText size={22} className="text-(--text-clr)/60" />
              <label htmlFor="content">Content</label>
            </div>

            <ContentEditor value={content} onChange={setContent} />
          </div>

          <form.Field name="imageUrl">
            {(field) => (
              <FormInputField
                field={field}
                type="url"
                label="Image URL"
                Icon={Image}
              />
            )}
          </form.Field>
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
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="flex items-center gap-2 py-2 px-4 bg-(--text-clr) text-(--bg-clr) rounded-md hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SquarePen size={24} /> Post
              </button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </Dialog>
  );
};

export default CreatePostDialog;
