import { UserIcon } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorFallback from "../components/ErrorFallback";
import PageTitle from "../components/PageTitle";
import Spinner from "../components/Spinner";
import UserListItem from "../components/UserListItem";
import { useUnfollowUser } from "../features/users/users.mutations";
import { useGetUser } from "../features/users/users.queries";
import { useAuth } from "../hooks/useAuth.hook";
import { handleError } from "../utils/utils";

type FollowingPageProps = {};

const FollowingPage = ({}: FollowingPageProps) => {
  const { auth } = useAuth();
  const loggedInUserId = auth?.user?.id;

  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUserId) {
      navigate("/login");
      toast.info("Please sign in first to access your profile");
      return;
    }
  }, []);

  const { data: user, isLoading, isError, error } = useGetUser(loggedInUserId!);

  const { mutate: unfollowMutation } = useUnfollowUser();

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    handleError(error);
    return <ErrorFallback error={error} />;
  }

  return (
    <section className="px-2">
      <PageTitle title="Following" />

      <h2 className="font-bold text-2xl mb-4">
        Users you are following ({user?.following?.length ?? 0})
      </h2>

      {user?.following?.length ? (
        <div className="space-y-3">
          {user.following.map((u) => (
            <UserListItem key={u.id} user={u} onUnfollow={unfollowMutation} />
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

export default FollowingPage;
