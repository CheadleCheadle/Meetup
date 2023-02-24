const { validationResult }  = require('express-validator');

const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors
          .array()
          .forEach(error => errors[error.param] = error.msg);

          const err = new Error("Validation error");
          err.errors = errors;
          err.status = 400;
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
    // const validationErrors = validationResult(req);
    if (!checkReq) {
        const errors = Error("Validation error");
            errors.statusCode = 400,
            errors.errors =  {
            address: "Street address is required",
            city: "City is required",
            state: "State is required",
            lat: "Latitude is not valid",
            lng:"Longitude is not valid",
            }
    next(errors);
}
next();
}



module.exports = {
    handleValidationErrors,
    handleCustomValidationErrors
}
