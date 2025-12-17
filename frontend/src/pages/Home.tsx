import { Link } from "react-router-dom";
import SliddingDashArrowIcon from "../components/SlidingDashArrowIcon";

type HomeProps = {};

const Home = ({}: HomeProps) => {
  return (
    <section className="px-2">
      <h1 className="text-4xl">
        <span className="font-bold">Share your knowledge</span> with the world
      </h1>
      <p className="text-2xl mt-4 text-gray-400">
        <span className="font-bold">Intellctify</span> is a platform that allows
        you read, write and deepen your understanding of various topics.
      </p>
      <Link
        to="/login"
        className="group inline-flex items-center gap-1 py-2 px-6 bg-(--text-clr) text-(--bg-clr) rounded mt-4 border hover:bg-(--bg-clr) hover:text-(--text-clr)"
      >
        Get Started <SliddingDashArrowIcon />
      </Link>
    </section>
  );
};

export default Home;
