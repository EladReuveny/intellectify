export const PostsPattern = {
  commands: {
    FIND_ALL: { cmd: 'posts.findAll' },
    FIND_ONE: { cmd: 'posts.findOne' },
    CREATE: { cmd: 'posts.create' },
    UPDATE: { cmd: 'posts.update' },
    REMOVE: { cmd: 'posts.remove' },
    FIND_USER_POSTS: { cmd: 'posts.findUserPosts' },
    TOGGLE_LIKE_POST: { cmd: 'posts.toggleLikePost' },
    FIND_USER_LIKED_POSTS: { cmd: 'posts.findUserLikedPosts' },
    CREATE_BOOKMARK: { cmd: 'posts.createBookmark' },
    FIND_BOOKMARK: { cmd: 'posts.findBookmark' },
    REMOVE_BOOKMARK: { cmd: 'posts.removeBookmark' },
    ADD_POST_TO_BOOKMARK: { cmd: 'posts.addPostToBookmark' },
    REMOVE_POST_FROM_BOOKMARK: { cmd: 'posts.removePostFromBookmark' },
    FIND_USER_BOOKMARKED_POSTS: {
      cmd: 'posts.findUserBookmarks',
    },
  },
  events: {},
} as const;
