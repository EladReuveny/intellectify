import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { findUserLikedPosts } from "../api/users.api";
import PageTitle from "../components/PageTitle";
import PostsList from "../components/PostsList";
import type { Like } from "../types/like.types";
import { handleError } from "../utils/utils";

type LikedPostsProps = {};

const LikedPosts = ({}: LikedPostsProps) => {
  const [likes, setLikes] = useState<Like[]>([]);

  const { userId } = useParams();

  useEffect(() => {
    const fetchLikedPostsByUserId = async () => {
      try {
        const data = await findUserLikedPosts(Number(userId));
        setLikes(data);
      } catch (err) {
        handleError(err);
      }
    };

    fetchLikedPostsByUserId();
  }, []);

  return (
    <section className="px-2">
      <PageTitle title="Liked Posts" />

      <div className="flex flex-col gap-4">
        <PostsList posts={likes.map((like) => like.post)} />
      </div>
    </section>
  );
};

export default LikedPosts;
