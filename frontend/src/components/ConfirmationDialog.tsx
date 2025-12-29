import { Check, CircleX, X } from "lucide-react";
import React, { useEffect } from "react";
import { handleError } from "../utils/utils";

type ConfirmationDialogProps = {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  onAction: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
};

const ConfirmationDialog = ({
  dialogRef,
  onAction,
  title,
  description,
  icon,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmationDialogProps) => {
  useEffect(() => {
    const handleOutSideClick = (e: MouseEvent) => {
      if (dialogRef?.current === e.target) {
        closeDialog();
      }
    };

    window.addEventListener("click", handleOutSideClick);

    return () => {
      window.removeEventListener("click", handleOutSideClick);
    };
  }, [dialogRef]);

  const closeDialog = () => {
    dialogRef?.current?.close();
  };

  const handleConfirm = async () => {
    try {
      await onAction();
    } catch (err) {
      handleError(err);
    } finally {
      closeDialog();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed top-1/2 left-1/2 -translate-1/2 bg-(--text-clr)/50 text-(--text-clr) backdrop:backdrop-blur-md p-4 rounded-md shadow-md"
    >
      <button
        type="button"
        onClick={closeDialog}
        title="Close"
        className="absolute top-0 right-0"
      >
        <CircleX />
      </button>

      {icon && <div className="mb-4 flex justify-center">{icon}</div>}
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && (
        <p className="text-(--text-clr)/85 mt-1">{description}</p>
      )}

      <div className="flex items-center justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={closeDialog}
          className="flex items-center gap-2 py-2 px-3 border border-gray-400 rounded-md hover:bg-(--text-clr)/10"
        >
          <X size={24} /> {cancelText}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="flex items-center gap-2 py-2 px-4 bg-(--text-clr) text-(--bg-clr) rounded-md hover:brightness-90"
        >
          <Check size={24} /> {confirmText}
        </button>
      </div>
    </dialog>
  );
};

export default ConfirmationDialog;
