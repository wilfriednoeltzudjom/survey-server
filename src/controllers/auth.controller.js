const buildSignUpUseCase = require('../use_cases/accounts/signUp.usecase');
const buildSignInUseCase = require('../use_cases/accounts/signIn.usecase');
const buildGetAccountsUseCase = require('../use_cases/accounts/getAccounts.usecase');
const buildGetProfileUseCase = require('../use_cases/accounts/getProfile.usecase');
const buildCreateAccountUseCase = require('../use_cases/accounts/createAccount.usecase');
const buildDeleteAccountUseCase = require('../use_cases/accounts/deleteAccount.usecase');
const { HttpResponse } = require('../application/payloads');
const MESSAGES = require('../application/messages');

module.exports = function buildAuthController(dependencies) {
  const signUpUseCase = buildSignUpUseCase(dependencies);
  const signInUseCase = buildSignInUseCase(dependencies);
  const getAccountsUseCase = buildGetAccountsUseCase(dependencies);
  const getProfileUseCase = buildGetProfileUseCase(dependencies);
  const createAccountUseCase = buildCreateAccountUseCase(dependencies);
  const deleteAccountUseCase = buildDeleteAccountUseCase(dependencies);

  async function signUp(request) {
    const response = await signUpUseCase.execute(request.body);

    return HttpResponse.created({
      message: MESSAGES.SIGNED_UP,
      data: response,
    });
  }

  async function signIn(request) {
    const response = await signInUseCase.execute(request.body);

    return HttpResponse.succeeded({
      message: MESSAGES.SIGNED_IN,
      data: response,
    });
  }

  async function getAccounts() {
    const accounts = await getAccountsUseCase.execute();

    return HttpResponse.succeeded({
      data: accounts,
    });
  }

  async function getProfile(request) {
    const profile = await getProfileUseCase.execute({ user: request.user });

    return HttpResponse.succeeded({
      data: profile,
    });
  }

  async function createAccount(request) {
    const account = await createAccountUseCase.execute(request.body, { user: request.user });

    return HttpResponse.created({
      message: MESSAGES.ACCOUNT_CREATED,
      data: account,
    });
  }

  async function deleteAccount(request) {
    const account = await deleteAccountUseCase.execute(request.params, { user: request.user });

    return HttpResponse.succeeded({
      message: MESSAGES.ACCOUNT_DELETED(account),
      data: account,
    });
  }

  async function signOut() {
    return HttpResponse.succeeded({
      message: MESSAGES.SIGNED_OUT,
    });
  }

  return { signIn, signUp, getAccounts, getProfile, signOut, createAccount, deleteAccount };
};
