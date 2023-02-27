const express = require("express");
const router = require('express').Router();
const { Group, Membership, GroupImage, User, Venue } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { validateGroupBody, validateVenueBody } = require('../../utils/body-validation');
//Edit a Venue specified by its id
router.put('/:venueId', [requireAuth, validateVenueBody], async (req, res) => {
    const { user } = req;

    let { venueId } = req.params
    venueId = parseInt(venueId);

    const {address, city, state, lat, lng } = req.body;


    const venue = await Venue.scope('noUp').findByPk(venueId, {include: Group})

    if (!venue) {
        return res.status(404).json({message: "Venue couldn't be found", statusCode: 404})
    }
    const membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: venue.dataValues.Group.dataValues.id
        }
    });
    if (!membership) {
        return res.status(403).json({message: "Forbidden", statusCode: 403});
    }


    if (user.id === venue.dataValues.Group.dataValues.organizerId || membership.status === "co-host") {
        venue.set({ address, city, state, lat, lng });
        venue.save();
        delete venue.dataValues.Group;
        return res.status(200).json(venue);
    } else {
    res.status(403).json({message: "Forbidden", statusCode: 403});
    }
})



module.exports = router;
