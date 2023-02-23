const express = require("express");
const router = require('express').Router();
const { Group, Membership, GroupImage, User, Venue, Event, Attendance, EventImage} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {  handleCustomValidationErrors } = require('../../utils/validation');

//Delete an Image for a Group

router.delete('/:imageId', requireAuth, async (req, res) => {
    const { user } = req;
    let { imageId } = req.params;
    imageId = parseInt(imageId);
    const image = await GroupImage.findByPk(imageId, {include: Group});
    if (!image) {
        return res.status(404).json({message: "Group Image couldn't be found", statusCode: 404});
    }
    const membership = await Membership.findOne({
        where: {
            userId: image.dataValues.Group.dataValues.organizerId
        }
    });
    const currentUserMembership = await Membership.findOne({
        where: {
            userId: user.id
        }
    })

    if (membership || currentUserMembership.dataValues.status === "co-host") {
        await image.destroy();
        return res.status(200).json({message: "Successfully deleted", statusCode: 200});
    }
})

module.exports = router;
