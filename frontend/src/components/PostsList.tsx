import type { Post } from "../types/post.types";
import PostCard from "./PostCard";

type PostsListProps = {
  posts: Post[];
  showRemoveFromCurrentBookmark?: boolean;
  showRemovePost?: boolean;
};

const PostsList = ({
  posts,
  showRemoveFromCurrentBookmark = false,
  showRemovePost = false,
}: PostsListProps) => {
  return (
    <div className="flex flex-col gap-5">
      {posts.map((post, i) => (
        <PostCard
          key={post.id}
          post={post}
          index={i}
          showRemoveFromCurrentBookmark={showRemoveFromCurrentBookmark}
          showRemovePost={showRemovePost}
        />
      ))}
    </div>
  );
};

export default PostsList;
