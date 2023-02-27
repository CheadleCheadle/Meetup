
const express = require("express");
const { at } = require("lodash");
const router = require('express').Router();
const { Group, Membership, GroupImage, User, Venue, Event, Attendance, EventImage, Sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {  handleCustomValidationErrors } = require('../../utils/validation');
const { validateEventBody } = require('../../utils/body-validation');
const Op = Sequelize.Op;
//Get all Events
router.get('/', async (req, res) => {

    let { page, size, name, type, startDate } = req.query;
    if (!page) page = 1;
    if (!size) size = 20;

    page = parseInt(page);
    size = parseInt(size);

    console.log(page, size, typeof page, typeof size);

    let pagination = {};
    pagination.limit = size;
    pagination.offset = size * (page - 1);

    console.log(pagination);


const events = await Event.findAll({
        ...pagination,
    attributes: {
        exclude: ["capacity", "price", "description"]
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
    delete event.dataValues.Group.dataValues.createdAt;
    delete event.dataValues.Group.dataValues.updatedAt;
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
        include: [{
            model: Group,
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        }, "Venue"]
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
    const event = await Event.findByPk(eventId, {include: Group});
    if (!event) res.status(404).json({message: "Event couldn't be found", statusCode: 404});

    const attendanceMembership = await Attendance.findOne({
        where: {
            userId: user.id,
            eventId
        }
    });
    // const currentMembership = await Membership.findOne({
    //     where: {
    //         userId: user.id,
    //         groupId: event.dataValues.Group.dataValues.id
    //     }
    // })

    if (!attendanceMembership) {
        return res.status(403).json({message: "Forbidden", statusCode: 403});
    }
    //ASSUMING THAT MEMBERSHIP STATUS CANT BE ATTENDEE
    const roles = [ "attendee","host", "co-host"];
    if (roles.includes(attendanceMembership.dataValues.status.toLowerCase())) {
        const image = await EventImage.create({eventId, userId: user.id, url, preview});
        delete image.dataValues.createdAt;
        delete image.dataValues.updatedAt;
        delete image.dataValues.eventId;
        res.status(200).json(image);
    }
});
//Edit an Event by Id
router.put('/:eventId', [requireAuth, validateEventBody], async (req, res) => {
    const { user } = req;
    let { eventId } = req.params;
    eventId = parseInt(eventId);
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    const event = await Event.findByPk(eventId, {include: Group});
      if (!event) return res.status(404).json({message: "Event couldn't be found", statusCode: 404});
    const membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: event.dataValues.Group.dataValues.id
        },
    });

    const venue = await Venue.findByPk(venueId);


    if (!membership) {
       return res.status(403).json({message: "Forbidden", statusCode: 403});
    }
    if (!venue) return res.status(404).json({message: "Venue couldn't be found", statusCode: 404});

    if (event.groupId === membership.groupId || membership.status === "co-host") {
        event.set({ venueId, name, type, capacity, price, description, startDate, endDate });
        await event.save();
        delete event.dataValues.updatedAt;
        delete event.dataValues.Group;
        res.status(200).json(event);
    } else {
        return res.status(403).json({message: "Forbidden", statusCode: 403});
    }

});
//Delete event by Id
router.delete('/:eventId', requireAuth, async (req, res) => {
    const { user } = req;
    let { eventId } = req.params;
    eventId = parseInt(eventId);
    const event = await Event.findByPk(eventId);
    console.log(event);
    if (!event) return res.status(404).json({message: "Event couldn't be found", statusCode: 404});
    const membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: event.dataValues.groupId
        }
    });

    if (!membership) {
        return res.status(403).json({message: "Forbidden", statusCode: 403});
    }

    if (membership.groupId === event.dataValues.groupId || membership.status === "co-host") {
        await event.destroy();
        res.status(200).json({message: "Successfully deleted"});
    }

});

//Get all Attendees of an Event specified by its id

router.get('/:eventId/attendees', async (req, res) => {
    const { user } = req;
    let { eventId } = req.params;
    eventId = parseInt(eventId);
    const event = await Event.findByPk(eventId, {
        include: Group
    });

    if (!event) {
        return res.status(404).json({message: "Event couldn't be found", statusCode: 404});
    }
    const membershipOfUser = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: event.dataValues.groupId

        }
    })
     console.log(membershipOfUser);

    if (event.dataValues.Group.dataValues.organizerId === user.id || membershipOfUser.dataValues.status === "co-host") {
        console.log("FIRST");
        const attendants = await Attendance.findAll({
            where: {
                eventId
            },
            // include: {model: User, attributes: ["id","firstName","lastName"]}
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        });
        for (let i = 0; i < attendants.length; i++) {
            let attendant = attendants[i];
            const user = await User.findOne({
                where: {
                    id: attendant.userId
                }
            })
            attendant.dataValues.id = user.id;
            attendant.dataValues.firstName = user.firstName;
            attendant.dataValues.lastName = user.lastName;
            delete attendant.dataValues.userId;
            attendant.dataValues.Attendance = {status: attendant.status};
            delete attendant.dataValues.status;
        }
        res.status(200).json({Attendees: attendants});
    } else {
        console.log("SECOND");
        const attendants = await Attendance.findAll({
            where: {
                eventId,
                status: {
                    [Op.not]: "pending"
                }
            },
            attributes: {
                exclude: ["updatedAt", "createdAt"]
            }
        });

        for (let i = 0; i < attendants.length; i++) {
            let attendant = attendants[i];
            const user = await User.findOne({
                where: {
                    id: attendant.userId
                }
            })
            attendant.dataValues.id = user.id;
            attendant.dataValues.firstName = user.firstName;
            attendant.dataValues.lastName = user.lastName;
            delete attendant.dataValues.userId;
            attendant.dataValues.Attendance = {status: attendant.status};
            delete attendant.dataValues.status;
        }
        res.status(200).json({Attendees: attendants});
    }
});

//Request to Attend an Event based on the Event's id
//RE TEST
router.post('/:eventId/attendance', requireAuth, async (req, res) => {
    let { eventId } = req.params;
    eventId = parseInt(eventId);
    const { user } = req;
    const event = await Event.findByPk(eventId);

        if (!event) {
        return res.status(404).json({message: "Event couldn't be found", statusCode: 404});
    }

    const currentMembership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: event.dataValues.groupId
        }
    });
    if (!currentMembership || currentMembership.dataValues.groupId !== event.dataValues.groupId || currentMembership.dataValues.status === "pending") {
        return res.status(403).json({message: "Forbidden", statusCode: 403});
    }


    const attendanceCheck = await Attendance.findOne({
        where: {
            userId: user.id,
            eventId
        }
    });
    if (attendanceCheck) {
    if (attendanceCheck.status === "pending") {
        return res.status(400).json({message: "Attendance has already been requested", statusCode: 400});
        // console.log("HI mom");
    } else if (attendanceCheck.status !== "pending") {
        return res.status(400).json({message: "User is already an attendee of the event", statusCode: 400});
    }
}
    const newAttendant = await Attendance.create({eventId, userId: user.id, status: "pending"});
    delete newAttendant.dataValues.id;
    delete newAttendant.dataValues.eventId;
    delete newAttendant.dataValues.updatedAt;
    delete newAttendant.dataValues.createdAt;
    return res.status(200).json(newAttendant);


//     const membership = await Membership.findOne({
//         where: {
//             userId: user.id
//         }
//     });
//     if (membership) {
//     if (membership.dataValues.groupId === event.dataValues.groupId) {
//         const newAttendant = await Attendance.create({eventId, userId: user.id, status: "pending"});
//         return res.status(200).json(newAttendant);
//     }
//    } else {
//     return res.status(400).json({message: "User doesn't have a membership"});
//    }
});

//Change the status of an attendance for an event specified by id
//RE TEST
router.put('/:eventId/attendance', requireAuth, async (req, res) => {
    let { eventId } = req.params;
    eventId = parseInt(eventId);
    const { user } = req;
    const { userId, status } = req.body;
    const event = await Event.findByPk(eventId);

        if (!event) {
        return res.status(404).json({message: "Event couldn't be found", statusCode: 404});
    }
    const membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: event.dataValues.groupId
        }
    });
    console.log(membership);
    if (!membership || membership.dataValues.groupId !== event.dataValues.groupId || !["host", "co-host"].includes(membership.dataValues.status)) {
        return res.status(403).json({message: "Forbidden", statusCode: 403});
    }


    if (status === "pending") {
        return res.status(400).json({message: "Cannot change an attendance status to pending"});
    }

    const attendance = await Attendance.findOne({
        where: {
            eventId,
            userId
        }
    });
    //PROBABLY PUT THIS HIGHER UP SO IT CHECKS ATTENDANCE AFTER AUTHORIZING USER
    if (!attendance) {
          return res.status(404).json({message: "Attendance between the user and the event does not exist"});

    }


    if (membership.dataValues.groupId === event.dataValues.groupId
        || membership.dataValues.status === "co-host") {
            attendance.set({ userId, status });
            await attendance.save();
            delete attendance.dataValues.createdAt;
            delete attendance.dataValues.updatedAt;
            return res.status(200).json(attendance);
    }
});

//Delete attendance to an event specified by id

router.delete('/:eventId/attendance', requireAuth, async (req, res) => {
    let { eventId } = req.params;
    eventId = parseInt(eventId);
    const { user } = req;
    let { userId } = req.body;
    userId = parseInt(userId);
    const event = await Event.findByPk(eventId, {include: Group});
    //CHECK AUTHORIZATION FIRST
//IF attendanceToDelete.userId !== user.id || user.id !== event.group.organizerId

    if (!event) {
        return res.status(404).json({message: "Event couldn't be found", statusCode: 404});
    }
    const attendanceToDelete = await Attendance.findOne({
        where: {
            eventId,
            userId
        }
    });

    if (!attendanceToDelete) {
       return res.status(404).json({message: "Attendance does not exist for this user", statusCode: 404});
    }

    if (event.dataValues.Group.dataValues.organizerId === user.id) {
        await attendanceToDelete.destroy();
        return res.status(200).json({message: "Successfully deleted attendance from event"});
    } else if (user.id === attendanceToDelete.dataValues.userId) {
        await attendanceToDelete.destroy();
        return res.status(200).json({message: "Successfully deleted attendance from event"});
    } else {
        return res.status(403).json({message: "Only the User or organizer may delete an Attendance"});
    }
});

module.exports = router;
