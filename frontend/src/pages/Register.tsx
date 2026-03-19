import { useForm } from "@tanstack/react-form";
import { Lock, LogIn, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import z from "zod";
import FormInputField from "../components/FormInputField";
import { useRegisterUser } from "../features/auth/auth.mutations";

const registerSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(5, "Password must be at least 5 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
    ),
});

type RegisterProps = {};

const Register = ({}: RegisterProps) => {
  const { mutate: registerUserMutation } = useRegisterUser();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: registerSchema,
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => registerUserMutation(value),
  });

  return (
    <section className="px-2 text-center flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-2">Sign Up Account</h1>
      <p className="text-(--text-clr)/60">
        Join our platform and start sharing knowledge and learning
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="w-1/2"
      >
        <div className="space-y-3 mt-4">
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

          <form.Field name="password">
            {(field) => (
              <FormInputField
                field={field}
                type="password"
                label="Password"
                Icon={Lock}
              />
            )}
          </form.Field>
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

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="mt-2 bg-(--text-clr) text-(--bg-clr) py-2 rounded-md w-full flex items-center justify-center gap-2 text-xl hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn size={28} />
              Register
            </button>
          )}
        </form.Subscribe>
      </form>
    </section>
  );
};

export default Register;
