import { useForm } from "@tanstack/react-form";
import { SquarePen, Type, X } from "lucide-react";
import React from "react";
import z from "zod";
import { useCreateBookmark } from "../features/bookmarks/bookmarks.mutations";
import Dialog from "./Dialog";
import FormInputField from "./FormInputField";

const createBookmarkSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

type CreateBookmarkDialogProps = {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
};

const CreateBookmarkDialog = ({ dialogRef }: CreateBookmarkDialogProps) => {
  const { mutate: createBookmarkMutation } = useCreateBookmark();

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const form = useForm({
    defaultValues: {
      title: "",
    },
    validators: {
      onChange: createBookmarkSchema,
      onSubmit: createBookmarkSchema,
    },
    onSubmit: async ({ value }) =>
      createBookmarkMutation(value, {
        onSuccess: () => {
          closeDialog();
          form.reset();
        },
      }),
  });

  return (
    <Dialog dialogRef={dialogRef} title="Create Bookmark">
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
        </div>

        <div className="flex items-center justify-end gap-3 mt-5">
          <button
            type="reset"
            onClick={closeDialog}
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
                <SquarePen size={24} /> Create
              </button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </Dialog>
  );
};

export default CreateBookmarkDialog;
