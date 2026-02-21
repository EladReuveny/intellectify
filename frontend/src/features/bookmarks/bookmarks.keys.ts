export const bookmarksKeys = {
  all: ["bookmarks"],
  details: (bookmarkId: number) => [...bookmarksKeys.all, bookmarkId],
} as const;
