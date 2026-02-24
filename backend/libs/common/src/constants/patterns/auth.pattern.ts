export const AuthPattern = {
  commands: {
    LOGIN: { cmd: 'auth.login' },
    REGISTER: { cmd: 'auth.register' },
    FORGOT_PASSWORD: { cmd: 'auth.forgot-password' },
    RESET_PASSWORD: { cmd: 'auth.reset-password' },
  },
  events: {},
} as const;
