export const USERS_PATTERNS = {
  commands: {
    FIND_ALL: { cmd: 'users.findAll' },
    FIND_ONE: { cmd: 'users.findOne' },
    UPDATE: { cmd: 'users.update' },
    REMOVE: { cmd: 'users.remove' },
  },
  events: {},
} as const;
