module.exports = {
  TAX_NOTICE_NOT_VALID: 'Les informations fiscales saisies sont incorrectes ou ne sont plus en date.',
  SURVEY_PDF_GENERATION_ERROR(survey, error) {
    return `Error while trying to generate pdf for survey ${survey.id} : ${error.message}`;
  },
  SURVEY_NOT_FOUND({ surveyId }) {
    return `Unabled to find survey using id ${surveyId}`;
  },
  SURVEY_CREATED: 'Votre formulaire a bien été enregistré',
  SURVEY_DELETED(survey) {
    return `Le formulaire ${survey.reference} a bien été supprimé`;
  },
  SURVEY_GENERATED(survey) {
    return `Le formulaire ${survey.reference} a bien été régénéré`;
  },
  SURVEY_ALREADY_EXISTS({ taxNoticeNumber, taxNoticeReference }) {
    return `Un formulaire a déjà été créé avec le numéro fiscal ${taxNoticeNumber} et la référence ${taxNoticeReference} `;
  },
};
