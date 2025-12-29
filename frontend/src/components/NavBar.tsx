import {
  CircleUserRound,
  LogIn,
  LogOut,
  MenuIcon,
  Search,
  SquarePen,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.hook";
import CreatePostDialog from "./CreatePostDialog";
import Logo from "./Logo";
import SideBar from "./SideBar";
import UserAvatar from "./UserAvatar";

const NavBar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [] = useState("");

  const { auth, logout } = useAuth();
  const user = auth?.user;

  const sideBarDialog = useRef<HTMLDialogElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const createPostDialog = useRef<HTMLDialogElement | null>(null);


  const openSideBarDialog = () => {
    sideBarDialog.current?.showModal();
  };

  const openCreatePostDialog = () => {
    createPostDialog.current?.showModal();
  };


  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isUserMenuOpen && !userMenuRef?.current?.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isUserMenuOpen]);

  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button type="button" title="Open Sidebar" onClick={openSideBarDialog}>
          <MenuIcon className="w-6 h-6 text-gray-400 hover:text-(--text-clr)" />
        </button>
        <Logo />
      </div>

      <Search className="text-gray-400 cursor-pointer hover:text-(--text-clr)" />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={openCreatePostDialog}
          className="flex items-center gap-2 py-2 px-3 bg-(--text-clr) text-(--bg-clr) rounded hover:brightness-90"
        >
          <SquarePen /> Create
        </button>

        {user ? (
          <div ref={userMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="align-middle hover:text-(--text-clr)"
            >
              {user?.avatarUrl ? (
                <UserAvatar size={44} avatarUrl={user.avatarUrl} />
              ) : (
                <UserAvatar size={44} />
              )}
            </button>

            {isUserMenuOpen && (
              <div className="absolute top-12 right-0 space-y-2 bg-(--bg-clr) text-(--text-clr) border border-gray-400 rounded-md shadow-lg p-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 py-2 px-4 rounded whitespace-nowrap hover:bg-(--text-clr)/25"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <CircleUserRound className="w-7 h-7" /> Profile
                </Link>
                <hr className="text-gray-400 my-2" />
                <Link
                  to="/login"
                  onClick={handleLogout}
                  className="flex items-center gap-2 py-2 px-4 rounded whitespace-nowrap hover:bg-(--text-clr)/25 text-red-500 hover:text-red-400"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </Link>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 py-2 px-3 border rounded-md hover:bg-(--text-clr)/15"
          >
            <LogIn /> Sign In
          </Link>
        )}
      </div>

      <SideBar dialogRef={sideBarDialog} />

      <CreatePostDialog dialogRef={createPostDialog} />
    </nav>
  );
};

export default NavBar;
