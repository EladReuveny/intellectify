import { KeyRound, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import PasswordToggleButton from "../components/PasswordToggleButton";
import { useResetPassword } from "../features/auth/auth.mutations";

type ResetPasswordProps = {};

const ResetPassword = ({}: ResetPasswordProps) => {
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isShowNewConfirmPassword, setIsShowNewConfirmPassword] =
    useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { mutate: resetPasswordMutation } = useResetPassword();

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const newPassword = formData.get("newPassword") as string;
    const confirmNewPassword = formData.get("confirmNewPassword") as string;

    if (!token) {
      toast.error("Invalid or expired token. Please try again.");
      return;
    }

    resetPasswordMutation(
      { token, newPassword, confirmNewPassword },
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
  };

  return (
    <section className="px-2 text-center flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
      <p className="text-gray-400 mb-2">
        Enter your new password and confirm it to reset your password
      </p>

      <form onSubmit={(e) => handleResetPassword(e)} className="w-1/2">
        <div className="space-y-3 mt-4">
          <div className="relative">
            <Lock className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400" />
            <input
              type={isShowNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              placeholder=""
              required
              className="peer border border-gray-400 py-2 px-9 w-full rounded-md hover:border-(--text-clr) focus:border-(--text-clr) focus:shadow-[0_0_15px_var(--text-clr)]"
            />
            <label
              htmlFor="newPassword"
              className="absolute top-1/2 left-9 -translate-y-1/2 
            peer-focus:text-xs peer-focus:top-0 peer-focus:left-4 peer-focus:bg-(--bg-clr) peer-focus:px-1
            peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs
            peer-[:not(:placeholder-shown)]:bg-(--bg-clr) peer-[:not(:placeholder-shown)]:px-1"
            >
              New Password
            </label>
            <PasswordToggleButton
              isVisible={isShowNewPassword}
              onToggle={() => setIsShowNewPassword((prev) => !prev)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400" />
            <input
              type={isShowNewConfirmPassword ? "text" : "password"}
              id="confirmNewPassword"
              name="confirmNewPassword"
              placeholder=""
              required
              className="peer border border-gray-400 py-2 px-9 w-full rounded-md hover:border-(--text-clr) focus:border-(--text-clr) focus:shadow-[0_0_15px_var(--text-clr)]"
            />
            <label
              htmlFor="confirmNewPassword"
              className="absolute top-1/2 left-9 -translate-y-1/2 
            peer-focus:text-xs peer-focus:top-0 peer-focus:left-4 peer-focus:bg-(--bg-clr) peer-focus:px-1
            peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs
            peer-[:not(:placeholder-shown)]:bg-(--bg-clr) peer-[:not(:placeholder-shown)]:px-1"
            >
              Confirm New Password
            </label>
            <PasswordToggleButton
              isVisible={isShowNewConfirmPassword}
              onToggle={() => setIsShowNewConfirmPassword((prev) => !prev)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-(--text-clr) text-(--bg-clr) py-2 rounded-md w-full flex items-center justify-center gap-2 text-xl hover:brightness-90"
        >
          <KeyRound size={28} />
          Reset Password
        </button>
      </form>
    </section>
  );
};

export default ResetPassword;
