export const MailPattern = {
  commands: {},
  events: {
    SEND_RESET_PASSWORD_EMAIL: {
      event: 'mail.sendResetPasswordEmail',
    },
    SEND_RESET_PASSWORD_CONFIRMATION_EMAIL: {
      event: 'mail.sendResetPasswordConfirmationEmail',
    },
  },
} as const;
