const express = require("express");
const router = require('express').Router();
const { Group, Membership, GroupImage, User, Venue, Event, Attendance, EventImage} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {  handleCustomValidationErrors } = require('../../utils/validation');

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
    const currentUserMembership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: group.id
        }
    })
    if (!currentUserMembership) {
        return res.status(400).json({message: "Unauthorized request", statusCode: 400});
    }
    console.log(group.dataValues.organizerId )
    console.log( currentUserMembership.dataValues.status)
    if (group.dataValues.organizerId === user.id || currentUserMembership.dataValues.status === "co-host") {
        await image.destroy();
        return res.status(200).json({message: "Successfully deleted", statusCode: 200});
    }
})
module.exports = router;
