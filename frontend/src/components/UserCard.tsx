import { Mail, UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { User } from "../types/user.types";
import UserAvatar from "./UserAvatar";

type UserCardProps = {
  user: User;
};

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div
      className="group relative overflow-hidden p-4 rounded-lg border border-(--text-clr)/25
                hover:border-(--text-clr)/50 hover:shadow-[0_0_3px_0_var(--text-clr)] hover:bg-linear-to-b from-transparent to-(--text-clr)/15"
    >
      <div>
        <UserAvatar avatarUrl={user.avatarUrl} size={80} />
      </div>

      <div className="text-center mt-2 mb-4">
        <h3 className="font-semibold text-lg mb-1">User #{user.id}</h3>
        <div className="flex items-center justify-center gap-1 text-(--text-clr)/60 text-sm mb-2">
          <Mail size={18} />
          <span className="truncate">{user.email}</span>
        </div>

        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            user.role === "admin"
              ? "bg-green-500/20 text-green-500"
              : "bg-blue-500/20 text-blue-500"
          }`}
        >
          {`${user.role[0].toUpperCase()}${user.role.slice(1)}`}
        </span>

        <p className="text-xs text-(--text-clr)/60 mt-1">
          Joined {""}
          {new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="w-full space-y-2 mt-4">
        <Link
          to={`/@${user.email.split("@")[0]}`}
          state={{ userId: user.id }}
          className="py-2 px-4 rounded-lg bg-(--text-clr)/15 hover:bg-(--text-clr)/25 font-medium
                    flex items-center justify-center gap-2"
        >
          <UserIcon size={22} />
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
