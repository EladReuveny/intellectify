import { UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUser, unfollowUser } from "../api/users.api";
import PageTitle from "../components/PageTitle";
import UserListItem from "../components/UserListItem";
import { useAuth } from "../hooks/useAuth.hook";
import type { User } from "../types/user.types";
import { handleError } from "../utils/utils";

const Following = () => {
  const { auth } = useAuth();
  const loggedInUserId = auth?.user?.id;

  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!loggedInUserId) {
          navigate("/login");
          toast.info("Please sign in first to access your profile");
          return;
        }

        const freshUser = await getUser(loggedInUserId);
        setUser(freshUser);
      } catch (err) {
        handleError(err);
      }
    };

    fetchUser();
  }, []);

  const handleUnfollow = async (userIdToUnfollow: number) => {
    try {
      const data = await unfollowUser(userIdToUnfollow);
      setUser(data);
      toast.success("Unfollowed successfully");
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <section className="px-2">
      <PageTitle title="Following" />

      <h2 className="font-bold text-2xl mb-4">
        Users you are following ({user?.following?.length ?? 0})
      </h2>

      {user?.following?.length ? (
        <div className="space-y-3">
          {user.following.map((u) => (
            <UserListItem key={u.id} user={u} onUnfollow={handleUnfollow} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <UserIcon size={44} />
          <p>You are not following any users yet.</p>
        </div>
      )}
    </section>
  );
};

export default Following;
