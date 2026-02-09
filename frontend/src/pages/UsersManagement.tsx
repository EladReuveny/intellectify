import { Mail, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllUsers } from "../api/users.api";
import Loading from "../components/Loading";
import PageTitle from "../components/PageTitle";
import UserAvatar from "../components/UserAvatar";
import { useAuth } from "../hooks/useAuth.hook";
import type { User } from "../types/user.types";
import { handleError } from "../utils/utils";

type UsersManagementProps = {};

const UsersManagement = ({}: UsersManagementProps) => {
  const { auth } = useAuth();
  const user = auth?.user;
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingList, setFollowingList] = useState<number[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      toast.info("Please sign in first to access your following");
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await getAllUsers();
        // Filter out current user from the list
        const filteredUsers = usersData.filter((u) => u.id !== user?.id);
        setUsers(filteredUsers);
        // Initialize with some default following (for demo purposes)
        // In production, this would come from the API
        setFollowingList([]);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, navigate]);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="px-2">
      <PageTitle title="Users Management" />

      <p className="text-gray-400 mb-5">
        Manage and view users ({users.length ?? 0})
      </p>

      {users.length ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
          {users.map((u) => (
            <div
              key={u.id}
              className="group relative overflow-hidden p-4 rounded-lg border border-(--text-clr)/25
                hover:border-(--text-clr)/50 hover:shadow-[0_0_3px_0_var(--text-clr)] hover:bg-linear-to-b from-transparent to-(--text-clr)/15"
            >
              <div>
                <UserAvatar avatarUrl={u.avatarUrl} size={80} />
              </div>

              <div className="text-center mt-2 mb-4">
                <h3 className="font-semibold text-lg mb-1">User #{u.id}</h3>
                <div className="flex items-center justify-center gap-1 text-gray-400 text-sm mb-2">
                  <Mail size={18} />
                  <span className="truncate">{u.email}</span>
                </div>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    u.role === "admin"
                      ? "bg-green-500/20 text-green-500"
                      : "bg-blue-500/20 text-blue-500"
                  }`}
                >
                  {`${u.role[0].toUpperCase()}${u.role.slice(1)}`}
                </span>

                <p className="text-xs text-gray-400 mt-1">
                  Joined {""}
                  {new Date(u.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="w-full space-y-2 mt-4">
                <Link
                  to={`/@${u.email.split("@")[0]}`}
                  state={{ userId: u.id }}
                  className="py-2 px-4 rounded-lg bg-(--text-clr)/15 hover:bg-(--text-clr)/25 font-medium
                    flex items-center justify-center gap-2"
                >
                  <UserIcon size={22} />
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <UserIcon className="w-16 h-16" />
          <p className="text-lg">No users available yet</p>
        </div>
      )}
    </section>
  );
};

export default UsersManagement;
