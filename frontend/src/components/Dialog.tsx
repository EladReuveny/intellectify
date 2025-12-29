import { CircleX } from "lucide-react";
import { type ReactNode, type RefObject } from "react";
import DialogTitle from "./DialogTitle";

type DialogProps = {
  children: ReactNode;
  dialogRef: RefObject<HTMLDialogElement | null>;
  title: string;
};

const Dialog = ({ children, dialogRef, title }: DialogProps) => {
  const closeDialog = () => {
    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed top-1/2 left-1/2 -translate-1/2 py-2 px-4 w-screen h-screen bg-(--bg-clr) text-(--text-clr) rounded-md shadow-lg backdrop:backdrop-blur-md border border-gray-400"
    >
      <button
        type="button"
        onClick={closeDialog}
        title="Close"
        className="absolute top-0 right-0"
      >
        <CircleX />
      </button>

      <DialogTitle title={title} />

      {children}
    </dialog>
  );
};

export default Dialog;
