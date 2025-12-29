import { Calendar, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { findPost, toggleLikePost } from "../api/posts.api";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../hooks/useAuth.hook";
import type { Post } from "../types/post.types";
import { handleError } from "../utils/utils";

type PostsDetailsProps = {};

const PostDetails = ({}: PostsDetailsProps) => {
  const [post, setPost] = useState<Post | null>(null);

  const { postId } = useParams();

  const { auth } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();

  const isUserLikedPost = post?.likes.some((like) => like.userId === user?.id);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const data = await findPost(Number(postId));
        setPost(data);
      } catch (err) {
        handleError(err);
      }
    };

    fetchPostDetails();
  }, []);

  const handleToggleLikePost = async () => {
    try {
      if (!user) {
        toast.info("Please sign in first to like a post");
        navigate("/login");
        return;
      }

      const updatedPost = await toggleLikePost(Number(postId));
      setPost(updatedPost);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <article className="px-2">
      <PageTitle title="Post Details" />

      <main>
        <h2 className="text-3xl font-bold mb-2">{post?.title}</h2>

        <div className="flex items-center gap-3">
          <div
            title="Created at"
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-(--text-clr)"
          >
            <Calendar size={20} />{" "}
            {post?.createdAt &&
              new Date(post.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
          </div>
          <button
            type="button"
            onClick={handleToggleLikePost}
            title={isUserLikedPost ? "Unlike" : "Like"}
            className={`flex items-center gap-1 text-sm 
              ${isUserLikedPost ? "fill-(--text-clr)" : "text-gray-400"}  hover:text-(--text-clr)`}
          >
            <ThumbsUp size={20} fill="" /> {post?.likes.length}
          </button>
        </div>

        <img
          src={post?.imageUrl || undefined}
          alt={post?.title}
          title={post?.title}
          className="w-3/4 object-contain mx-auto my-4"
        />

        <p>{post?.content}</p>
      </main>
    </article>
  );
};

export default PostDetails;
