const e = require("express");
const express = require("express");
const router = require('express').Router();
const { Group, Membership, GroupImage, User, Venue, Event, Attendance, EventImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {  handleCustomValidationErrors } = require('../../utils/validation');
//Get all Events
router.get('/', async (req, res) => {
const events = await Event.findAll({
    attributes: {
        exclude: ["capacity", "price"]
    },
    include: ["Group", "Venue"]
});
for (let i = 0; i < events.length; i++) {
    let event = events[i];
    const numAttend = await Attendance.count({
        where: {
            eventId: event.id
        }
    });
    const image = await EventImage.findOne({
        where: {eventId: event.id}
    })
    // console.log(event);
    event.dataValues.numAttending = numAttend;
    event.dataValues.previewImage = image.url;
    delete event.dataValues.Group.dataValues.organizerId;
    delete event.dataValues.Group.dataValues.type;
    delete event.dataValues.Group.dataValues.about;
    delete event.dataValues.Group.dataValues.private;
    delete event.dataValues.Venue.dataValues.groupId;
    delete event.dataValues.Venue.dataValues.address;
    delete event.dataValues.Venue.dataValues.lat;
    delete event.dataValues.Venue.dataValues.lng;
}
res.status(200).json({Events:events});
});

router.get('/:eventId', async (req, res) => {
    let { eventId } = req.params;
    eventId = parseInt(eventId);
    const event = await Event.findOne({
        where: {
            id: eventId
        },
        include: ["Group", "Venue"]
    });
    const numAttend = await Attendance.count({
        where: {
            eventId
        }
    });

    const images = await EventImage.findAll({
        where: {
            eventId
        }
    })

    if (!event) {
        return res.status(404).json({message: "Event couldn't be found", statusCode: 404});
    }

    event.dataValues.numAttending = numAttend;
    event.dataValues.EventImages = images;
    delete event.dataValues.Group.dataValues.organizerId;
    delete event.dataValues.Group.dataValues.type;
    delete event.dataValues.Group.dataValues.about;
    delete event.dataValues.Venue.dataValues.groupId;
    return res.status(200).json(event);
});


module.exports = router;
