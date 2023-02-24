const { validationResult, body } = require('express-validator');

const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors
          .array()
          .forEach(error => errors[error.param] = error.msg);

          const err = Error("Bad request");
          err.errors = errors;
          err.status = 400;
          err.title = "Bad request.";
          next(err);
    }
    next();
};
const checkReq = (req) => {
    const body  = req.body;
    const leger = ['address', 'city', 'state', 'late', 'lng'];
    const actual = Object.keys(body);
    if (leger !== actual) return false
    else return true
}

const handleCustomValidationErrors = (req, _res, next) => {
    // const validationErrors = validationResult(req)
    // body('name')

// next();
}



module.exports = {
    handleValidationErrors,
    handleCustomValidationErrors
}
