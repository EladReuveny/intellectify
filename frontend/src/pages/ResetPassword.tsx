import { useForm } from "@tanstack/react-form";
import { KeyRound, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import z from "zod";
import FormInputField from "../components/FormInputField";
import { useResetPassword } from "../features/auth/auth.mutations";

const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(5, "Password must be at least 5 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
    ),
  confirmNewPassword: z
    .string()
    .min(5, "Password must be at least 5 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
    ),
});

type ResetPasswordProps = {};

const ResetPassword = ({}: ResetPasswordProps) => {
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isShowNewConfirmPassword, setIsShowNewConfirmPassword] =
    useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { mutate: resetPasswordMutation } = useResetPassword();

  const form = useForm({
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    validators: {
      onChange: resetPasswordSchema,
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      if (!token) {
        toast.error("Invalid or expired token. Please try again.");
        return;
      }

      resetPasswordMutation(
        {
          token,
          newPassword: value.newPassword,
          confirmNewPassword: value.confirmNewPassword,
        },
        {
          onSuccess: ({
            userId,
            message,
          }: {
            userId: number;
            message: string;
          }) => {
            toast.success(message);
            navigate("/login");
          },
        },
      );
    },
  });

  return (
    <section className="px-2 text-center flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
      <p className="text-(--text-clr)/60 mb-2">
        Enter your new password and confirm it to reset your password
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="w-1/2"
      >
        <div className="space-y-3 mt-4">
          <form.Field name="newPassword">
            {(field) => (
              <FormInputField
                field={field}
                type="password"
                label="New Password"
                Icon={Lock}
              />
            )}
          </form.Field>

          <form.Field name="confirmNewPassword">
            {(field) => (
              <FormInputField
                field={field}
                type="password"
                label="Confirm New Password"
                Icon={Lock}
              />
            )}
          </form.Field>
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="mt-4 bg-(--text-clr) text-(--bg-clr) py-2 rounded-md w-full flex items-center justify-center gap-2 text-xl hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <KeyRound size={28} />
              Reset Password
            </button>
          )}
        </form.Subscribe>
      </form>
    </section>
  );
};

export default ResetPassword;
