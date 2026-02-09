export const USERS_PATTERNS = {
  commands: {
    FIND_ALL: { cmd: 'users.findAll' },
    FIND_ONE: { cmd: 'users.findOne' },
    UPDATE: { cmd: 'users.update' },
    REMOVE: { cmd: 'users.remove' },
    FOLLOW_USER: { cmd: 'users.followUser' },
    UNFOLLOW_USER: { cmd: 'users.unfollowUser' },
  },
  events: {},
} as const;
