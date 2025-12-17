import { Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";

type RegisterProps = {};

const Register = ({}: RegisterProps) => {
  return (
    <section className="px-2 text-center flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-2">Sign Up Account</h1>
      <p className="text-gray-400">
        Join our platform and start sharing knowledge and learning
      </p>

      <form className="w-1/2">
        <div className="space-y-3 mt-4">
          <div className="relative">
            <Mail className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder=""
              className="peer border border-gray-400 py-2 px-9 w-full rounded-md hover:border-(--text-clr) focus:border-(--text-clr) focus:shadow-[0_0_15px_var(--text-clr)]"
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
            <Lock className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              id="password"
              name="password"
              placeholder=""
              className="peer border border-gray-400 py-2 px-9 w-full rounded-md hover:border-(--text-clr) focus:border-(--text-clr) focus:shadow-[0_0_15px_var(--text-clr)]"
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
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 mb-4 text-sm">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-(--text-clr) underline underline-offset-2 hover:no-underline"
            >
              Sign In
            </Link>
          </p>
        </div>

        <button
          type="submit"
          className="mb-3 bg-(--text-clr) text-(--bg-clr) py-2 rounded-md w-full hover:brightness-90"
        >
          Register
        </button>
      </form>
    </section>
  );
};

export default Register;
