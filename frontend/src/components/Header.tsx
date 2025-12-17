import NavBar from "./NavBar";

type HeaderProps = {};

const Header = ({}: HeaderProps) => {
  return (
    <header className="p-4 bg-(--bg-clr)/50 backdrop-blur-md">
      <NavBar />
    </header>
  );
};

export default Header;
