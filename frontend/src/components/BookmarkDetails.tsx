import { useAtom } from "jotai";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { findBookmark } from "../api/bookmarks.api";
import { useAuth } from "../hooks/useAuth.hook";
import { bookmarkAtom } from "../store/bookmarks.atoms";
import { handleError } from "../utils/utils";
import PageTitle from "./PageTitle";
import PostsList from "./PostsList";

type BookmarkDetailsProps = {};

const BookmarkDetails = ({}: BookmarkDetailsProps) => {
  // const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  const [bookmark, setBookmark] = useAtom(bookmarkAtom);

  const { bookmarkId } = useParams();

  const { auth, logout } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      toast.info("Please sign in first to access bookmark details");
      return;
    }

    const fetchBookmark = async () => {
      try {
        const data = await findBookmark(Number(bookmarkId));
        setBookmark(data);
      } catch (err) {
        handleError(err);
        navigate("/login");
        logout();
      }
    };

    fetchBookmark();
  }, []);

  return (
    <section className="px-2">
      <PageTitle title={bookmark?.title ?? "Bookmark Details"} />

      {bookmark?.posts?.length === 0 ? (
        <div className="text-center">
          <h2 className="font-bold text-2xl mb-1">No posts found</h2>
          <p className="text-gray-400">
            Add posts to this bookmark to see them here.
          </p>
        </div>
      ) : (
        <PostsList
          posts={bookmark?.posts ?? []}
          showRemoveFromCurrentBookmark={true}
        />
      )}
    </section>
  );
};

export default BookmarkDetails;
