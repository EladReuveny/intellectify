import { User as UserIcon } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorFallback from "../components/ErrorFallback";
import PageTitle from "../components/PageTitle";
import Spinner from "../components/Spinner";
import UserCard from "../components/UserCard";
import { useGetAllUsers } from "../features/users/users.queries";
import { useAuth } from "../hooks/useAuth.hook";
import { handleError } from "../utils/utils";

type UsersManagementProps = {};

const UsersManagement = ({}: UsersManagementProps) => {
  const { auth } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      toast.info("Please sign in first to access your following");
      return;
    }
  }, []);

  const { data: users, isLoading, isError, error } = useGetAllUsers();

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    handleError(error);
    return <ErrorFallback error={error} />;
  }

  return (
    <section className="px-2">
      <PageTitle title="Users Management" />

      <p className="text-(--text-clr)/60 mb-5">
        Manage and view users ({users?.length ?? 0})
      </p>

      {users?.length ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
          {users?.map((u) => (
            <UserCard key={u.id} user={u} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-(--text-clr)/60">
          <UserIcon className="w-16 h-16" />
          <p className="text-lg">No users available yet</p>
        </div>
      )}
    </section>
  );
};

export default UsersManagement;
