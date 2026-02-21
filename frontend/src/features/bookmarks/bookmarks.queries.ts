import { useQuery } from "@tanstack/react-query";
import { findBookmark } from "../../api/bookmarks.api";
import { bookmarksKeys } from "./bookmarks.keys";

export const useFindBookmark = (bookmarkId: number) =>
  useQuery({
    queryKey: bookmarksKeys.details(bookmarkId),
    queryFn: () => findBookmark(bookmarkId),
  });
