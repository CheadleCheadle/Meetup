const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupRouter = require('./groups.js');
const venueRouter = require('./venues.js');
const eventRouter = require('./events.js');
const groupImageRouter = require('./group-images.js');
const eventImageRouter = require('./event-images.js');
const { restoreUser } = require("../../utils/auth.js");

const { validateQueryParameters } = require('../../utils/body-validation');

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/groups', groupRouter);

router.use('/venues', venueRouter);

router.use('/events', eventRouter);

router.use('/group-images', groupImageRouter);

router.use('/event-images', eventImageRouter);

router.use(function(req, res, next) {
  if (req.query) {
    validateQueryParameters
  }
})
router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
