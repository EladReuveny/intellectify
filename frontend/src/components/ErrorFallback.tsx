import { AlertCircle, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface ErrorFallbackProps {
  title?: string;
  error?: Error;
}

const ErrorFallback = ({
  title = "Something went wrong",
  error = new Error("An unexpected error occurred. Please try again."),
}: ErrorFallbackProps) => {
  return (
    <section className="py-12 bg-linear-to-b from-transparent via-(--text-clr)/15 to-(--text-clr)/25 flex flex-col items-center">
      <AlertCircle
        size={100}
        className="text-red-500 bg-red-500/20 rounded-full p-4 shadow-[0_0_25px_rgba(239,68,68,0.5)]"
      />

      <div className="mt-4 text-center">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-(--text-clr)/60">{error?.message}</p>
      </div>

      <Link
        to={"/"}
        className="mt-4 px-6 py-3 bg-(--text-clr)/15 font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 hover:bg-(--text-clr)/25"
      >
        <Home size={24} />
        Back to Home
      </Link>

      <div className="mt-6 p-4 rounded-lg border border-(--text-clr)/25">
        <p className="text-xs text-(--text-clr)/60">
          If this problem persists, please contact support or check your
          internet connection.
        </p>
      </div>
    </section>
  );
};

export default ErrorFallback;
