import { MenuIcon, Plus, Search } from "lucide-react";
import { useRef } from "react";
import Logo from "./Logo";
import SideBar from "./SideBar";

type NavBarProps = {};

const NavBar = ({}: NavBarProps) => {
  const sideBarDialog = useRef<HTMLDialogElement | null>(null);

  const openSideBarDialog = () => {
    sideBarDialog.current?.showModal();
  };

  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button type="button" title="Open Sidebar" onClick={openSideBarDialog}>
          <MenuIcon className="w-6 h-6 text-gray-400 cursor-pointer hover:text-(--text-clr)" />
        </button>
        <Logo />
      </div>

      <Search className="text-gray-400 cursor-pointer hover:text-(--text-clr)" />

      <div className="">
        <button
          type="button"
          className="flex items-center gap-1 py-2 px-3 bg-(--text-clr) text-(--bg-clr) rounded cursor-pointer hover:brightness-90"
        >
          <Plus /> Create
        </button>
      </div>

      <SideBar sideBarDialog={sideBarDialog} />
    </nav>
  );
};

export default NavBar;
