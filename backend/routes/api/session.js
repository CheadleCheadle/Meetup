const express = require("express");
const { check } = require("express-validator");
const router = require('express').Router();
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie } = require("../../utils/auth");
const { User } = require("../../db/models");

const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true})
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
    handleValidationErrors
]
router.post(
  '/',
  validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.login({ credential, password });

    if (!user) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      err.statusCode = 401;
      // err.title = 'Login failed';
      // err.errors = { credential: 'The provided credentials were invalid.' };
      return next(err);
    }

    await setTokenCookie(res, user);
    delete user.dataValues.createdAt;
    delete user.dataValues.updatedAt;
    return res.json({
      user: user
    });
  }
);

router.delete(
  '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);

router.get(
    '/', (req, res) => {
        const { user } = req;
        if (user) {
            return res.json({
                user: user.toSafeObject()
            });
        } else return res.json({ user: null });
    }
)

module.exports = router;
