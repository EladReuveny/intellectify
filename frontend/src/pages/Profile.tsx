import { useForm } from "@tanstack/react-form";
import { Camera, Check, Edit, Lock, Mail, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import z from "zod";
import ErrorFallback from "../components/ErrorFallback";
import FormInputField from "../components/FormInputField";
import Spinner from "../components/Spinner";
import UserAvatar from "../components/UserAvatar";
import {
  useDeleteAccount,
  useUpdateUser,
} from "../features/users/users.mutations";
import { useGetUser } from "../features/users/users.queries";
import { useAuth } from "../hooks/useAuth.hook";
import { handleError } from "../utils/utils";

const updateUserSchema = z.object({
  email: z.email("Invalid email address"),
  currentPassword: z
    .string()
    .min(5, "Password must be at least 5 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
    ),
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

type ProfileProps = {};

const Profile = ({}: ProfileProps) => {
  const { auth } = useAuth();
  const currentUserId = auth?.user.id;

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUserId) {
      navigate("/login");
      toast.info("Please sign in first to access your profile");
    }
  }, []);

  const { data: user, isLoading, isError, error } = useGetUser(currentUserId!);

  const { mutate: updateUserMutation } = useUpdateUser();

  const { mutate: deleteAccountMutation } = useDeleteAccount();

  const [isEditMode, setIsEditMode] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl);

  const handleUserAvatarUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAvatarUrl = event.target?.result as string;
        setAvatarUrl(newAvatarUrl);

        if (user?.id) {
          updateUserMutation({
            userId: user.id,
            updateUserDto: {
              email: user.email,
              avatarUrl: newAvatarUrl,
            },
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const form = useForm({
    defaultValues: {
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validators: {
      onChange: updateUserSchema,
      onSubmit: updateUserSchema,
    },
    onSubmit: async ({ value }) => {
      if (!user || !user?.id) return;
      updateUserMutation({
        userId: user.id,
        updateUserDto: {
          email: value.email,
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
          confirmNewPassword: value.confirmNewPassword,
          avatarUrl,
        },
      });
    },
  });

  const handleDeleteAccount = async () => {
    const answer = confirm("Are you sure you want to delete your account?");
    if (!answer || !user?.id) {
      return;
    }

    deleteAccountMutation(user.id);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    handleError(error);
    return <ErrorFallback error={error} />;
  }

  return (
    <section className="px-2">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-full h-0.5 bg-linear-to-r from-transparent to-(--text-clr)" />
        <h1 className="text-4xl font-bold">Profile</h1>
        <div className="w-full h-0.5 bg-linear-to-r from-(--text-clr) to-transparent" />
      </div>

      <div className="flex flex-col items-center gap-4">
        <UserAvatar avatarUrl={user?.avatarUrl} size={128} position="center" />
        <input
          type="file"
          id="avatar"
          name="avatar"
          accept="image/*"
          onChange={(e) => handleUserAvatarUpdate(e)}
          className="hidden"
        />
        <label
          htmlFor="avatar"
          className="flex items-center gap-2 py-2 px-4 bg-(--text-clr) text-(--bg-clr) rounded-md cursor-pointer hover:brightness-90"
        >
          <Camera size={24} /> Change Avatar
        </label>
      </div>

      <div className="border border-(--text-clr)/60 rounded-md shadow-md p-6 mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">User Details</h2>
          {!isEditMode && (
            <button
              type="button"
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-2 py-2 px-4 bg-(--text-clr) text-(--bg-clr) rounded-md hover:brightness-90"
            >
              <Edit size={24} /> Edit
            </button>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="space-y-4">
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
            {isEditMode && (
              <>
                <form.Field name="currentPassword">
                  {(field) => (
                    <FormInputField
                      field={field}
                      type="password"
                      label="Current Password"
                      Icon={Lock}
                    />
                  )}
                </form.Field>
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
              </>
            )}
          </div>

          {isEditMode && (
            <div className="flex items-center justify-end gap-3 mt-5">
              <button
                type="reset"
                onClick={() => setIsEditMode(false)}
                className="flex items-center gap-2 py-2 px-3 text-(--text-clr)/60 border border-(--text-clr)/60 rounded-md hover:bg-(--text-clr)/15"
              >
                <X size={24} /> Cancel
              </button>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="flex items-center gap-2 py-2 px-4 bg-(--text-clr) text-(--bg-clr) rounded-md hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check size={24} /> Save Changes
                  </button>
                )}
              </form.Subscribe>
            </div>
          )}
        </form>
      </div>

      <div className="border border-red-500 rounded-md shadow-md p-6 mt-6">
        <h2 className="text-xl font-bold">Delete Account</h2>
        <p className="text-(--text-clr)/60 mb-4">
          Are you sure you want to permanently delete your account and all of
          your content?
        </p>
        <button
          onClick={handleDeleteAccount}
          className="flex items-center gap-2 py-2 px-4 bg-red-500 rounded-md hover:brightness-90"
        >
          <Trash size={24} /> Delete Account
        </button>
      </div>
    </section>
  );
};

export default Profile;
