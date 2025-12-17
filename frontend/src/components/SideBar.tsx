import {
  ArrowRight,
  ChartNoAxesCombined,
  Clock4,
  Library,
  MenuIcon,
  Newspaper,
  ThumbsUp,
  Users,
} from "lucide-react";
import { useEffect, type RefObject } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";

type SideBarProps = {
  sideBarDialog: RefObject<HTMLDialogElement | null>;
};

const SideBar = ({ sideBarDialog }: SideBarProps) => {
  useEffect(() => {
    const handleDialogOutsideClick = (e: MouseEvent) => {
      const isBackGroundClicked = sideBarDialog.current === e.target;
      if (isBackGroundClicked) {
        sideBarDialog?.current?.close();
      }
    };

    sideBarDialog.current?.addEventListener("click", handleDialogOutsideClick);

    return () =>
      sideBarDialog.current?.removeEventListener(
        "click",
        handleDialogOutsideClick
      );
  }, []);

  const closeSideBarDialog = () => {
    sideBarDialog.current?.close();
  };

  return (
    <dialog
      ref={sideBarDialog}
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
            to="/subscriptions"
            className={({ isActive }) =>
              `flex items-center gap-4 py-1 px-2 rounded-md ${isActive ? "bg-(--text-clr) text-(--bg-clr)" : "hover:bg-(--text-clr)/25"}`
            }
          >
            <Users /> Subscriptions
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
              to="/read-later"
              className={({ isActive }) =>
                `flex items-center gap-4 py-1 px-3.5 rounded-md ${
                  isActive
                    ? "bg-(--text-clr) text-(--bg-clr)"
                    : "hover:bg-(--text-clr)/25"
                }`
              }
            >
              <Clock4 /> Read Later
            </NavLink>

            <NavLink
              to="/liked"
              className={({ isActive }) =>
                `flex items-center gap-4 py-1 px-3.5 rounded-md ${
                  isActive
                    ? "bg-(--text-clr) text-(--bg-clr)"
                    : "hover:bg-(--text-clr)/25"
                }`
              }
            >
              <ThumbsUp /> Liked Articles
            </NavLink>

            <NavLink
              to="/my-articles"
              className={({ isActive }) =>
                `flex items-center gap-4 py-1 px-3.5 rounded-md ${
                  isActive
                    ? "bg-(--text-clr) text-(--bg-clr)"
                    : "hover:bg-(--text-clr)/25"
                }`
              }
            >
              <Newspaper /> My Articles
            </NavLink>

            <NavLink
              to="/stats"
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
