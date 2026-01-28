import {
  ArrowDown,
  CircleUserRound,
  LogIn,
  LogOut,
  MenuIcon,
  Search,
  SlidersHorizontal,
  SquarePen,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.hook";
import CreatePostDialog from "./CreatePostDialog";
import Dialog from "./Dialog";
import Logo from "./Logo";
import SideBar from "./SideBar";
import UserAvatar from "./UserAvatar";

const NavBar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { auth, logout } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();

  const sideBarDialog = useRef<HTMLDialogElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const createPostDialog = useRef<HTMLDialogElement | null>(null);
  const searchDialog = useRef<HTMLDialogElement | null>(null);

  const openSideBarDialog = () => sideBarDialog.current?.showModal();
  const openCreatePostDialog = () => createPostDialog.current?.showModal();
  const openSearchDialog = () => searchDialog.current?.showModal();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isUserMenuOpen && !userMenuRef.current?.contains(e.target as Node)) {
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

  const sortByOptions: { value: string; label: string }[] = [
    { value: "title", label: "Title" },
    { value: "createdAt", label: "Date Created" },
    { value: "likes", label: "Likes" },
    { value: "comments", label: "Comments" },
  ];

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const search = formData.get("searchQuery") as string;
    const sortBy = formData.get("sortByQuery") as
      | "createdAt"
      | "title"
      | "likes"
      | "comments";
    const order = formData.get("orderQuery") as "ASC" | "DESC";

    searchDialog.current?.close();

    navigate(`/posts?q=${search}&sortBy=${sortBy}&order=${order}`);
  };

  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button type="button" title="Open Sidebar" onClick={openSideBarDialog}>
          <MenuIcon className="w-6 h-6 text-gray-400 hover:text-(--text-clr)" />
        </button>
        <Logo />
      </div>

      <button type="button" title="Search" onClick={openSearchDialog}>
        <Search className="text-gray-400 hover:text-(--text-clr)" />
      </button>

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
            <button type="button" onClick={() => setIsUserMenuOpen((p) => !p)}>
              <UserAvatar size={44} avatarUrl={user.avatarUrl} />
            </button>

            {isUserMenuOpen && (
              <div className="absolute top-12 right-0 w-48 space-y-2 bg-(--bg-clr) border border-gray-400 rounded-md shadow-lg p-3">
                <Link
                  to="/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-(--text-clr)/20"
                >
                  <CircleUserRound /> Profile
                </Link>

                <hr />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded text-red-500 hover:bg-red-500/10"
                >
                  <LogOut /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 py-2 px-3 border rounded hover:bg-(--text-clr)/15"
          >
            <LogIn /> Sign In
          </Link>
        )}
      </div>

      <SideBar dialogRef={sideBarDialog} />
      <CreatePostDialog dialogRef={createPostDialog} />

      <Dialog dialogRef={searchDialog} title="Search posts">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative mb-4">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              id="searchQuery"
              name="searchQuery"
              placeholder="Search posts..."
              className="w-full py-2 px-10 rounded-full border border-gray-400 hover:border-(--text-clr) focus:border-(--text-clr) focus:outline-none"
            />

            <button
              type="submit"
              className="
                absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-(--text-clr) text-(--bg-clr) flex items-center justify-center hover:brightness-90"
            >
              <Search size={18} />
            </button>
          </div>

          <details className="group">
            <summary className="flex items-center gap-2 w-fit px-4 py-2 rounded-full bg-(--text-clr) text-(--bg-clr) cursor-pointer hover:brightness-90">
              <SlidersHorizontal size={18} />
              Filters
              <ArrowDown className="group-open:rotate-180" />
            </summary>

            <div className="mt-4 flex flex-wrap gap-5">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Sort by</label>
                <select
                  name="sortByQuery"
                  defaultValue={sortByOptions[0].value}
                  className="py-2 px-3 bg-(--bg-clr) text-(--text-clr) border border-gray-400 rounded hover:border-(--text-clr) focus:outline-none"
                >
                  {sortByOptions.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold">Order</span>
                {[
                  { value: "desc", label: "Descending" },
                  { value: "asc", label: "Ascending" },
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="orderQuery"
                      value={value}
                      defaultChecked={value === "desc"}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </details>
        </form>
      </Dialog>
    </nav>
  );
};

export default NavBar;
