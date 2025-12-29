import NavBar from "./NavBar";

type HeaderProps = {};

const Header = ({}: HeaderProps) => {
  return (
    <header className="p-4 bg-(--bg-clr)/50 backdrop-blur-md fixed top-0 left-0 w-screen z-100">
      <NavBar />
    </header>
  );
};

export default Header;
