import { User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllUsers } from "../api/users.api";
import Loading from "../components/Loading";
import PageTitle from "../components/PageTitle";
import UserCard from "../components/UserCard";
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

  useEffect(() => {
    if (!user) {
      navigate("/login");
      toast.info("Please sign in first to access your following");
      return;
    }

    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
          {users.map((u) => (
            <UserCard key={u.id} user={u} />
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
