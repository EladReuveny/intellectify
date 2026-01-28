import {
  ArrowRight,
  Bookmark,
  ChartNoAxesCombined,
  Library,
  MenuIcon,
  Newspaper,
  ThumbsUp,
  Users,
} from "lucide-react";
import { useEffect, type RefObject } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.hook";
import Logo from "./Logo";

type SideBarProps = {
  dialogRef: RefObject<HTMLDialogElement | null>;
};

const SideBar = ({ dialogRef: dialogRef }: SideBarProps) => {
  const { auth } = useAuth();
  const userId = auth?.user.id;

  const location = useLocation();

  useEffect(() => {
    const handleDialogOutsideClick = (e: MouseEvent) => {
      const isBackGroundClicked = dialogRef.current === e.target;
      if (isBackGroundClicked) {
        closeSideBarDialog();
      }
    };

    document.addEventListener("click", handleDialogOutsideClick);

    return () =>
      document.removeEventListener("click", handleDialogOutsideClick);
  }, []);

  useEffect(() => {
    closeSideBarDialog();
  }, [location]);

  const closeSideBarDialog = () => {
    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="absolute top-0 left-0 w-1/3 h-screen overflow-y-auto p-4 
      backdrop:backdrop-brightness-50 backdrop:backdrop-blur bg-(--bg-clr) text-(--text-clr)
      -translate-x-full opacity-0 transition-all duration-300 ease-in-out
      open:translate-x-0 open:opacity-100"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          title="Close Sidebar"
          onClick={closeSideBarDialog}
        >
          <MenuIcon className="w-6 h-6 text-gray-400 cursor-pointer hover:text-(--text-clr) rounded-md" />
        </button>
        <Logo />
      </div>

      <div className="space-y-4 mt-6">
        <div>
          <NavLink
            to="/following"
            className={({ isActive }) =>
              `flex items-center gap-4 py-1 px-2 rounded-md ${isActive ? "bg-(--text-clr) text-(--bg-clr)" : "hover:bg-(--text-clr)/25"}`
            }
          >
            <Users /> Following
          </NavLink>
        </div>

        <hr className="text-gray-400 my-2" />

        <details className="group">
          <summary className="flex items-center gap-4 mb-2 py-1 px-2 cursor-pointer rounded-md hover:bg-(--text-clr)/25">
            <Library /> My Library{" "}
            <ArrowRight className="group-open:rotate-90" />
          </summary>

          <ul className="space-y-2">
            <NavLink
              to={`/users/${userId}/bookmarks`}
              className={({ isActive }) =>
                `flex items-center gap-4 py-1 px-3.5 rounded-md ${
                  isActive
                    ? "bg-(--text-clr) text-(--bg-clr)"
                    : "hover:bg-(--text-clr)/25"
                }`
              }
            >
              <Bookmark /> Bookmarks
            </NavLink>

            <NavLink
              to={`/users/${userId}/liked-posts`}
              className={({ isActive }) =>
                `flex items-center gap-4 py-1 px-3.5 rounded-md ${
                  isActive
                    ? "bg-(--text-clr) text-(--bg-clr)"
                    : "hover:bg-(--text-clr)/25"
                }`
              }
            >
              <ThumbsUp /> Liked Posts
            </NavLink>

            <NavLink
              to={`users/${userId}/posts`}
              className={({ isActive }) =>
                `flex items-center gap-4 py-1 px-3.5 rounded-md ${
                  isActive
                    ? "bg-(--text-clr) text-(--bg-clr)"
                    : "hover:bg-(--text-clr)/25"
                }`
              }
            >
              <Newspaper /> My Posts
            </NavLink>

            <NavLink
              to={`/users/${userId}/stats`}
              className={({ isActive }) =>
                `flex items-center gap-4 py-1 px-3.5 rounded-md ${
                  isActive
                    ? "bg-(--text-clr) text-(--bg-clr)"
                    : "hover:bg-(--text-clr)/25"
                }`
              }
            >
              <ChartNoAxesCombined /> Stats
            </NavLink>
          </ul>
        </details>
      </div>
    </dialog>
  );
};

export default SideBar;
