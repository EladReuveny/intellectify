import { Camera, Check, Edit, Lock, Mail, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { removeUser, updateUser } from "../api/users.api";
import PasswordToggleButton from "../components/PasswordToggleButton";
import UserAvatar from "../components/UserAvatar";
import { useAuth } from "../hooks/useAuth.hook";
import { handleError } from "../utils/utils";

type ProfileProps = {};

const Profile = ({}: ProfileProps) => {
  const { auth, logout } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      toast.info("Please sign in first to access your profile");
    }
  }, []);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isShowCurrentPassword, setIsShowCurrentPassword] = useState(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isShowConfirmNewPassword, setIsShowConfirmNewPassword] =
    useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl);

  const handleUserAvatarUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setAvatarUrl(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || !user?.id) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const email = formData.get("email") as string;
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmNewPassword = formData.get("confirmNewPassword") as string;

    await updateUser(user.id, {
      email,
      currentPassword,
      newPassword,
      confirmNewPassword,
      avatarUrl,
    });
  };

  const handleDeleteAccount = async () => {
    const answer = confirm("Are you sure you want to delete your account?");
    if (!answer || !user?.id) {
      return;
    }

    try {
      await removeUser(user.id);
      logout();
      navigate("/");
      toast.success("Your account has been deleted successfully");
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <section className="px-2">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-full h-0.5 bg-linear-to-r from-transparent to-(--text-clr)" />
        <h1 className="text-4xl font-bold">Profile</h1>
        <div className="w-full h-0.5 bg-linear-to-r from-(--text-clr) to-transparent" />
      </div>

      <div className="flex flex-col items-center gap-4">
        <UserAvatar avatarUrl={avatarUrl} size={128} position="center" />
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
          className="flex items-center gap-2 py-2 px-4 bg-(--text-clr) text-(--bg-clr) rounded-md hover:brightness-90"
        >
          <Camera size={24} /> Change Avatar
        </label>
      </div>

      <div className="border border-gray-400 rounded-md shadow-md p-6 mt-6">
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

        <form onSubmit={handleUpdateUser}>
          <div className="space-y-4">
            <div className="relative">
              <Mail
                className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400"
                size={24}
              />
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={user?.email}
                disabled={!isEditMode}
                placeholder=" "
                className="peer border border-gray-400 py-2 px-9 w-full rounded-md hover:border-(--text-clr) focus:border-(--text-clr) focus:shadow-[0_0_15px_var(--text-clr)]"
              />
              <label
                htmlFor="email"
                className="absolute top-1/2 left-9 -translate-y-1/2
              peer-focus:text-xs peer-focus:top-0 peer-focus:left-4 peer-focus:bg-(--bg-clr) peer-focus:px-1
              peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs
              peer-[:not(:placeholder-shown)]:bg-(--bg-clr) peer-[:not(:placeholder-shown)]:px-1"
              >
                Email Address
              </label>
            </div>
            {isEditMode && (
              <>
                <div className="relative">
                  <Lock
                    className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400"
                    size={24}
                  />
                  <input
                    type={isShowCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    placeholder=" "
                    className="peer border border-gray-400 py-2 px-9 w-full rounded-md hover:border-(--text-clr) focus:border-(--text-clr) focus:shadow-[0_0_15px_var(--text-clr)]"
                  />
                  <label
                    htmlFor="currentPassword"
                    className="absolute top-1/2 left-9 -translate-y-1/2
              peer-focus:text-xs peer-focus:top-0 peer-focus:left-4 peer-focus:bg-(--bg-clr) peer-focus:px-1
              peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs
              peer-[:not(:placeholder-shown)]:bg-(--bg-clr) peer-[:not(:placeholder-shown)]:px-1"
                  >
                    Current Password
                  </label>
                  <PasswordToggleButton
                    isVisible={isShowCurrentPassword}
                    onToggle={() => setIsShowCurrentPassword((prev) => !prev)}
                  />
                </div>
                <div className="relative">
                  <Lock
                    className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400"
                    size={24}
                  />
                  <input
                    type={isShowNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    placeholder=" "
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
                  <Lock
                    className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400"
                    size={24}
                  />
                  <input
                    type={isShowConfirmNewPassword ? "text" : "password"}
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    placeholder=" "
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
                    isVisible={isShowConfirmNewPassword}
                    onToggle={() =>
                      setIsShowConfirmNewPassword((prev) => !prev)
                    }
                  />
                </div>
              </>
            )}
          </div>

          {isEditMode && (
            <div className="flex items-center justify-end gap-3 mt-5">
              <button
                type="reset"
                onClick={() => setIsEditMode(false)}
                className="flex items-center gap-2 py-2 px-3 text-gray-400 border border-gray-400 rounded-md hover:bg-(--text-clr)/10"
              >
                <X size={24} /> Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 py-2 px-4 bg-(--text-clr) text-(--bg-clr) rounded-md hover:brightness-90"
              >
                <Check size={24} /> Save Changes
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="border border-red-500 rounded-md shadow-md p-6 mt-6">
        <h2 className="text-xl font-bold">Delete Account</h2>
        <p className="text-gray-400 mb-4">
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
