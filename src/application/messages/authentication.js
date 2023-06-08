module.exports = {
  TOKEN_EXPIRED({ token }) {
    return `You are allowed to access this resource: token ${token} has expired`;
  },
  UNRECOGNIZED_TOKEN({ token }) {
    return `You are allowed to access this resource: token ${token} is not recognized`;
  },
  ACCOUNT_NOT_FOUND({ email, accountId }) {
    return `Unabled to find an account using `.concat(email ? `email ${email}` : accountId ? `id ${accountId}` : '').trim();
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
  ALREADY_EXISTING_ACCOUNT({ email }) {
    return `Un compte avec l'adresse email ${email} existe déjà`;
  },
  ACCOUNT_CREATED: 'Votre compte a bien été enregistré',
  ACCOUNT_DELETED(account) {
    return `Le compte ${account.email} a bien été supprimé`;
  },
  ACCOUNT_NON_DELETABLE_EXISTING_SURVEYS: 'Ce compte est lié à un ou plusieurs formulaires et ne peut pas être supprimé.',
};
