const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models/');
// const user = require('../../db/models/user');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('password')
      .not()
      .isEmail()
      .isString()
      .isLength({min: 6})
      .withMessage('Password must be 6 characters or more'),
    check('firstName')
      .exists( {checkFalsy: true })
      .notEmpty()
      .isString()
      .withMessage('First name is required'),
    check('lastName')
      .exists( {checkFalsy: true })
      .notEmpty()
      .isString()
      .withMessage('Last name is required'),
      handleValidationErrors
]
router.post(
    '/', validateSignup, async (req, res) => {
        const { email, password, username, firstName, lastName } = req.body;
        const user = await User.signup({ email, username, password, firstName, lastName });
        await setTokenCookie(res, user);

        return res.json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: ""
        });
    }
);
module.exports = router;
