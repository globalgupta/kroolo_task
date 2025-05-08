const helper = require('../helpers/api-response');
const { body, query, validationResult } = require('express-validator');


exports.validateRequest = async (req, res, next) => {
    const result = validationResult(req, res, next)
    if (!result.isEmpty()) {
        return helper.validationErrorWithData(res, result.array()[1]?.msg ?? result.array()[0].msg, result.array());
    }
    next();
};