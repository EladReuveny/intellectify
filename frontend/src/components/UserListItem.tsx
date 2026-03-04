import { UserMinus } from "lucide-react";
import { Link } from "react-router-dom";
import type { User } from "../types/user.types";
import UserAvatar from "./UserAvatar";

type UserListItemProps = {
  user: User;
  onUnfollow?: (userIdToUnfollow: number) => void;
};

const UserListItem = ({ user, onUnfollow }: UserListItemProps) => {
  return (
    <div
      key={user.id}
      className="flex items-center gap-4 p-4 bg-(--text-clr)/15 rounded-lg shadow-[0_0_2px_0_var(--text-clr)] hover:bg-(--text-clr)/25"
    >
      <Link
        to={`/@${user.email.split("@")[0]}`}
        state={{ userId: user.id }}
        className="flex items-center gap-4 w-full"
      >
        <UserAvatar avatarUrl={user.avatarUrl} size={64} />

        <div className="flex items-start justify-between w-full">
          <div>
            <h3 className="font-bold text-xl">{user.email.split("@")[0]}</h3>

            <div className="flex items-center gap-1.5 text-(--text-clr)/60 text-sm">
              <span>{user.followers?.length ?? 0} followers</span>
              <span>•</span>
              <span>
                {" "}
                Joined {""}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {onUnfollow && (
        <button
          onClick={() => onUnfollow(user.id)}
          title="Unfollow user"
          className="p-2 rounded-full hover:bg-(--text-clr)/25"
        >
          <UserMinus size={22} />
        </button>
      )}
    </div>
  );
};

export default UserListItem;
