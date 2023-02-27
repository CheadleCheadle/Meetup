const express = require("express");
const router = require('express').Router();
const { Group, Membership, GroupImage, User, Venue, Event, Attendance, EventImage} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {  handleCustomValidationErrors } = require('../../utils/validation');
//Delete image for an event by imageId
router.delete('/:imageId', requireAuth, async (req, res) => {
    const { user } = req;
    let { imageId } = req.params;
    imageId = parseInt(imageId);
    //CHECK AUTH
    //current user must be the organizer or co-host of the group that the event belongs to
    //find membership, check status, find event, then events group, then groupOrganizerId must === user.id
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
module.exports = router;
