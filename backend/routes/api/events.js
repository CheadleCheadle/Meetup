const express = require("express");
const router = require('express').Router();
const { Group, Membership, GroupImage, User, Venue, Event, Attendance } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {  handleCustomValidationErrors } = require('../../utils/validation');

router.get('/', async (req, res) => {
const events = await Event.findAll();

for (let i = 0; i < events.length; i++) {
    let event = events[i];
    const numAttend = await Attendance.count({
        where: {
            eventId: event.id
        }
    });
    event.numAttending = numAttend;
}
res.status(200).json(events);
})
module.exports = router;
