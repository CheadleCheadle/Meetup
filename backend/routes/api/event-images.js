const express = require("express");
const router = require('express').Router();
const { Group, Membership, GroupImage, User, Venue, Event, Attendance, EventImage} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {  handleCustomValidationErrors } = require('../../utils/validation');
const { singleMulterUpload, singlePublicFileUpload } = require("../../awsS3");
//Delete image for an event by imageId
router.delete('/:imageId', requireAuth, async (req, res) => {
    const { user } = req;
    let { imageId } = req.params;
    imageId = parseInt(imageId);

    const image = await EventImage.findByPk(imageId, {include: Event});
    if (!image) {
        return res.status(404).json({message: "Event Image couldn't be found", statusCode: 404});
    }

    const group = await Group.findOne({
        where: {
            id: image.dataValues.Event.dataValues.groupId
        }
    })

    const membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: image.dataValues.Event.dataValues.groupId
        }
    })

    if (user.id !== group.dataValues.organizerId && !membership) {
        return res.status(403).json({message: "Forbidden", statusCode: 403});
    }

    if (["host", "co-host"].includes(membership.dataValues.status) || group.dataValues.organizerId === user.id) {
        await image.destroy();
        return res.status(200).json({message: "Successfully deleted", statusCode: 200});
    } else {
        return res.status(403).json({message: "Forbidden", statusCode: 403});
    }
})

//Update image for an event
router.put('/:imageId/:eventId', requireAuth, singleMulterUpload("image"), async (req, res) => {
    const { user } = req;
    let { url } =  req.body;
    let {imageId, eventId } = req.params;
    imageId = parseInt(imageId);
    eventId = parseInt(eventId);
    const newUrl = await singlePublicFileUpload(req.file);

    if (newUrl) {
        url = newUrl;
    }


    console.log("222222222222222222222222222222222222222222222", url, imageId, eventId);

    const image = await EventImage.findByPk(imageId);

    if (!image) {
        return res.status(404).json({message: "Event image couldn't be found", statusCode: 404});
    }
    const event = await Event.findByPk(eventId);


    const currentMembership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: event.groupId
        }
    });

    if (!currentMembership) {
        return res.status(403).json({message: "Forbidden", status: 403});
    }

    if (["host", "co-host"].includes(currentMembership.dataValues.status) || event.organizerId === user.id) {
        image.set({
            url
        });
        await image.save()
        return res.status(200).json(image);
    } else {
        return res.status(403).json({message: "Forbidden", statusCode: 403});
    }

})

//Update image for an event default
router.put('/:imageId/default', requireAuth, async (req, res) => {
    const { user } = req;
    let { url, eventId } =  req.body;
    let {imageId } = req.params;
    imageId = parseInt(imageId);
    eventId = parseInt(eventId);

    console.log('111111111111111111111', url, eventId, req.body);


    console.log("221231231231231232222222222222222", url);

    const image = await EventImage.findByPk(imageId);

    if (!image) {
        return res.status(404).json({message: "Event image couldn't be found", statusCode: 404});
    }
    const event = await Event.findByPk(eventId);


    const currentMembership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: event.groupId
        }
    });

    if (!currentMembership) {
        return res.status(403).json({message: "Forbidden", status: 403});
    }

    if (["host", "co-host"].includes(currentMembership.dataValues.status) || event.organizerId === user.id) {
        image.set({
            url
        });
        await image.save()
        return res.status(200).json(image);
    } else {
        return res.status(403).json({message: "Forbidden", statusCode: 403});
    }

})


module.exports = router;
