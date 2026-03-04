import { ArrowLeft, Mail, Send } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useForgotPassword } from "../features/auth/auth.mutations";

type ForgotPasswordProps = {};

const ForgotPassword = ({}: ForgotPasswordProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate: forgotPasswordMutation } = useForgotPassword();

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const email = formData.get("email") as string;

    forgotPasswordMutation(
      { email },
      {
        onSuccess: () => {
          toast.success("Email sent successfully");
          setIsSubmitted(true);
        },
      },
    );
  };

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

          <form onSubmit={(e) => handleForgotPassword(e)} className="w-1/2">
            <Link
              to="/"
              className="text-sm text-(--text-clr)/60 mb-2 flex items-center gap-1 hover:text-(--text-clr)"
            >
              <ArrowLeft /> Go Back
            </Link>

            <div className="relative">
              <Mail className="absolute top-1/2 left-2 -translate-y-1/2 text-(--text-clr)/60" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder=""
                required
                className="peer border border-(--text-clr)/60 py-2 px-9 w-full rounded-md hover:border-(--text-clr) focus:border-(--text-clr) focus:shadow-[0_0_15px_var(--text-clr)]"
              />
              <label
                htmlFor="email"
                className="absolute top-1/2 left-9 -translate-y-1/2 
            peer-focus:text-xs peer-focus:top-0 peer-focus:left-4 peer-focus:bg-(--bg-clr) peer-focus:px-1
            peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs
            peer-[:not(:placeholder-shown)]:bg-(--bg-clr) peer-[:not(:placeholder-shown)]:px-1"
              >
                Email
              </label>
            </div>

            <button
              type="submit"
              className="mt-4 bg-(--text-clr) text-(--bg-clr) py-2 rounded-md w-full flex items-center justify-center gap-2 text-xl hover:brightness-90"
            >
              <Send size={28} />
              Send Reset Link
            </button>
          </form>
        </>
      )}
    </section>
  );
};

export default ForgotPassword;
