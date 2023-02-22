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
    if (image) {
    event.dataValues.previewImage = image.url;
    } else {
        event.dataValues.previewImage = null;
    }
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
//Get Details of Event by ID
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
//Add an Image to an Event
router.post('/:eventId/images', requireAuth, async (req, res) => {
    const { user } = req;
    let { eventId } = req.params;
    eventId = parseInt(eventId);
    const { url, preview } = req.body;
    const event = await Event.findByPk(eventId);
    if (!event) res.status(404).json({message: "Event couldn't be found", statusCode: 404});

    const attendanceMembership = await Attendance.findOne({
        where: {
            userId: user.id,
            eventId
        }
    });

    const roles = ["attendee", "host", "co-host"];
    console.log(attendanceMembership.status);
    if (roles.includes(attendanceMembership.dataValues.status.toLowerCase())) {
        const image = await EventImage.create({eventId, userId: user.id, url, preview});
        delete image.dataValues.createdAt;
        delete image.dataValues.updatedAt;
        delete image.dataValues.eventId;
        res.status(200).json(image);
    }
});
//Update event
router.put('/:eventId', requireAuth, async (req, res) => {
    const { user } = req;
    let { eventId } = req.params;
    eventId = parseInt(eventId);
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    const membership = await Membership.findOne({
        where: {
            userId: user.id
        },
    });

    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({message: "Event couldn't be found", statusCode: 404});
    if (!event.venueId) return res.status(404).json({message: "Venue couldn't be found", statusCode: 404});

    if (event.groupId === membership.groupId || membership.status === "co-host") {
        event.set({ venueId, name, type, capacity, price, description, startDate, endDate });
        await event.save();
        delete event.dataValues.updatedAt;
        res.status(200).json(event);
    }

});

router.delete('/:eventId', requireAuth, async (req, res) => {
    const { user } = req;
    let { eventId } = req.params;
    eventId = parseInt(eventId);
    const event = await Event.findByPk(eventId);
    const membership = await Membership.findOne({
        where: {
            userId: user.id
        }
    });
    if (!event) return res.status(404).json({message: "Event couldn't be found", statusCode: 404});

    if (membership.groupId === event.dataValues.groupId || membership.status === "co-host") {
        await event.destroy();
        res.status(200).json({message: "Successfully deleted"});
    }

})

module.exports = router;
