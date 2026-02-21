export const usersKeys = {
  all: ["users"],
  details: (userId: number) => [...usersKeys.all, userId],
  posts: (userId: number) => [...usersKeys.details(userId), "posts"],
  bookmarks: (userId: number) => [...usersKeys.details(userId), "bookmarks"],
  likedPosts: (userId: number) => [...usersKeys.details(userId), "likedPosts"],
} as const;
