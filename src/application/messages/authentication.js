module.exports = {
  TOKEN_EXPIRED({ token }) {
    return `You are allowed to access this resource: token ${token} has expired`;
  },
  UNRECOGNIZED_TOKEN({ token }) {
    return `You are allowed to access this resource: token ${token} is not recognized`;
  },
  ACCOUNT_NOT_FOUND({ email }) {
    return `Unabled to find an account using email ${email}`;
  },
  INCORRECT_PASSWORD({ email }) {
    return `Incorrect password for email ${email}`;
  },
  SIGNED_UP: 'Le compte a bien été enregistré',
  SIGNED_IN: 'Vous êtes connectés',
  SIGNED_OUT: 'Vous êtes déconnectés',
  ACCESS_NOT_ALLOWED: "You're not allowed to access this resource: token was not found",
  UNAUTHORIZED({ role }) {
    return `You are allowed to access this resource: role ${role} is not included in the authorized roles`;
  },
};
