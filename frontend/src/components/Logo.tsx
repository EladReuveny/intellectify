import { Link } from "react-router-dom";

type LogoProps = {};

const Logo = ({}: LogoProps) => {
  return (
    <Link to="/" className="text-2xl italic font-bold tracking-tight">
      Intellctify
    </Link>
  );
};

export default Logo;
