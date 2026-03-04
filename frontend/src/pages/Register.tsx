import { Lock, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import PasswordToggleButton from "../components/PasswordToggleButton";
import { useRegisterUser } from "../features/auth/auth.mutations";

type RegisterProps = {};

const Register = ({}: RegisterProps) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const { mutate: registerUserMutation } = useRegisterUser();

  const handleRegisterUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    registerUserMutation({ email, password });
  };

  return (
    <section className="px-2 text-center flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-2">Sign Up Account</h1>
      <p className="text-(--text-clr)/60">
        Join our platform and start sharing knowledge and learning
      </p>

      <form onSubmit={(e) => handleRegisterUser(e)} className="w-1/2">
        <div className="space-y-3 mt-4">
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

          <div className="relative">
            <Lock className="absolute top-1/2 left-2 -translate-y-1/2 text-(--text-clr)/60" />
            <input
              type={isShowPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder=""
              required
              className="peer border border-(--text-clr)/60 py-2 px-9 w-full rounded-md hover:border-(--text-clr) focus:border-(--text-clr) focus:shadow-[0_0_15px_var(--text-clr)]"
            />
            <label
              htmlFor="password"
              className="absolute top-1/2 left-9 -translate-y-1/2 
            peer-focus:text-xs peer-focus:top-0 peer-focus:left-4 peer-focus:bg-(--bg-clr) peer-focus:px-1
            peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs
            peer-[:not(:placeholder-shown)]:bg-(--bg-clr) peer-[:not(:placeholder-shown)]:px-1"
            >
              Password
            </label>
            <PasswordToggleButton
              isVisible={isShowPassword}
              onToggle={() => setIsShowPassword((prev) => !prev)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 mb-4 text-sm">
          <p className="text-(--text-clr)/60">
            Already have an account?{" "}
            <Link
              to="/login"
              state={{ from: "/register" }}
              className="font-bold text-(--text-clr) underline underline-offset-2 hover:no-underline"
            >
              Sign In
            </Link>
          </p>
        </div>

        <button
          type="submit"
          className="mt-2 bg-(--text-clr) text-(--bg-clr) py-2 rounded-md w-full flex items-center justify-center gap-2 text-xl hover:brightness-90"
        >
          <LogIn size={28} />
          Register
        </button>
      </form>
    </section>
  );
};

export default Register;
