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

      {likes.length === 0 ? (
        <div className="text-center">
          <h2 className="font-bold text-2xl mb-1">Empty liked post list</h2>
          <p className="text-gray-400">You have not liked any posts yet.</p>
        </div>
      ) : (
        <PostsList posts={likes.map((like) => like.post)} />
      )}
    </section>
  );
};

export default LikedPosts;
