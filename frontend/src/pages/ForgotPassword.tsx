import { useForm } from "@tanstack/react-form";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import z from "zod";
import FormInputField from "../components/FormInputField";
import { useForgotPassword } from "../features/auth/auth.mutations";

const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

type ForgotPasswordProps = {};

const ForgotPassword = ({}: ForgotPasswordProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate: forgotPasswordMutation } = useForgotPassword();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: forgotPasswordSchema,
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: ({ value }) =>
      forgotPasswordMutation(value, {
        onSuccess: () => {
          toast.success("Email sent successfully");
          setIsSubmitted(true);
        },
      }),
  });

  return (
    <section className="px-2 text-center flex flex-col items-center justify-center">
      {isSubmitted ? (
        <>
          <h1 className="text-3xl font-bold mb-2">Email Sent Successfully</h1>
          <p className="text-(--text-clr)/60 mb-2">
            If an account with the provided email exists, a password reset link
            has been sent. Please check your inbox and follow the instructions
            to reset your password.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
          <p className="text-(--text-clr)/60 mb-2">
            Enter your email to reset your password
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="w-1/2"
          >
            <Link
              to="/"
              className="text-sm text-(--text-clr)/60 mb-2 flex items-center gap-1 hover:text-(--text-clr)"
            >
              <ArrowLeft /> Go Back
            </Link>

            <form.Field name="email">
              {(field) => (
                <FormInputField
                  field={field}
                  type="email"
                  label="Email"
                  Icon={Mail}
                />
              )}
            </form.Field>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="mt-4 bg-(--text-clr) text-(--bg-clr) py-2 rounded-md w-full flex items-center justify-center gap-2 text-xl hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={28} />
                  Send Reset Link
                </button>
              )}
            </form.Subscribe>
          </form>
        </>
      )}
    </section>
  );
};

export default ForgotPassword;
