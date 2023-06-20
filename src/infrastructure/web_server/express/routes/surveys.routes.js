const express = require('express');

const { surveyController } = require('../../../../controllers');
const { HttpRequest } = require('../../../../application/payloads');

const router = express.Router({ mergeParams: true });

router.post('/', (req, res, next) => {
  surveyController
    .createSurvey(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch(next);
});

router.get('/', (req, res, next) => {
  surveyController
    .getSurveys(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch(next);
});

router.get('/:surveyId', (req, res, next) => {
  surveyController
    .getSurvey(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch(next);
});

router.put('/:surveyId/generate', (req, res, next) => {
  surveyController
    .generateSurveyReport(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch(next);
});

router.delete('/:surveyId', (req, res, next) => {
  surveyController
    .deleteSurvey(HttpRequest.fromExpress(req))
    .then((response) => res.status(response.status).json(response.toJSON()))
    .catch(next);
});

module.exports = router;
