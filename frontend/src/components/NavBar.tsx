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
import { useAuth } from "../hooks/useAuth";
import Logo from "./Logo";
import SideBar from "./SideBar";

const NavBar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { auth, logout } = useAuth();
  const user = auth?.user;

  const sideBarDialog = useRef<HTMLDialogElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const openSideBarDialog = () => {
    sideBarDialog.current?.showModal();
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
          className="flex items-center gap-2 py-2 px-3 bg-(--text-clr) text-(--bg-clr) rounded hover:brightness-90"
        >
          <SquarePen /> Create
        </button>

        {user ? (
          <div ref={userMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="hover:text-(--text-clr)"
            >
              {user?.avatarUrl ? (
                <img
                  src={user?.avatarUrl}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <img
                  src="data:image/jpeg;base64,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"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
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
                  className="flex items-center gap-2 py-2 px-4 rounded whitespace-nowrap hover:bg-(--text-clr)/25 text-red-500 hover:text-red-400 text-left"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </Link>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 py-2 px-3 bg-(--bg-clr) border rounded hover:shadow-[0_0_15px_var(--text-clr)]"
          >
            <LogIn /> Sign In
          </Link>
        )}
      </div>

      <SideBar sideBarDialog={sideBarDialog} />
    </nav>
  );
};

export default NavBar;
