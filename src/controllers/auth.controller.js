const buildSignUpUseCase = require('../use_cases/accounts/signUp.usecase');
const buildSignInUseCase = require('../use_cases/accounts/signIn.usecase');
const buildGetAccountsUseCase = require('../use_cases/accounts/getAccounts.usecase');
const buildGetProfileUseCase = require('../use_cases/accounts/getProfile.usecase');
const { HttpResponse } = require('../application/payloads');
const MESSAGES = require('../application/messages');

module.exports = function buildAuthController(dependencies) {
  const signUpUseCase = buildSignUpUseCase(dependencies);
  const signInUseCase = buildSignInUseCase(dependencies);
  const getAccountsUseCase = buildGetAccountsUseCase(dependencies);
  const getProfileUseCase = buildGetProfileUseCase(dependencies);

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
    const response = await getAccountsUseCase.execute();

    return HttpResponse.succeeded({
      data: response,
    });
  }

  async function getProfile(request) {
    const response = await getProfileUseCase.execute({ user: request.user });

    return HttpResponse.succeeded({
      data: response,
    });
  }

  async function signOut() {
    return HttpResponse.succeeded({
      message: MESSAGES.SIGNED_OUT,
    });
  }

  return { signIn, signUp, getAccounts, getProfile, signOut };
};
