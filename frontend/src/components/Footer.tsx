type FooterProps = {};

const Footer = ({}: FooterProps) => {
  return (
    <footer className="w-full bg-(--text-clr)/10 text-(--text-clr)/60 text-center py-10 mt-15">
      &copy; {new Date().getFullYear()} Intellctify. All Rights Reserved
    </footer>
  );
};

export default Footer;
