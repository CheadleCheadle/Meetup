const express = require("express");
const router = require('express').Router();
const { Group, Membership, GroupImage, User, Venue } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

//Edit a Venue specified by its id
router.put('/:venueId', requireAuth, async (req, res) => {
    const { user } = req;

    let { venueId } = req.params
    venueId = parseInt(venueId);

    const {address, city, state, lat, lng } = req.body;


    const venue = await Venue.scope('noUp').findByPk(venueId)
    const membership = await Membership.findOne({
        where: {
            userId: user.id
        }
    })
    if (!venue) {
        res.status(404).json({message: "Venue couldn't be found", statusCode: 404})
    }

    if (membership.groupId === venue.groupId || membership.status === "co-host") {
        venue.set({ address, city, state, lat, lng });
        venue.save();
        res.status(200).json(venue);
    }
})



module.exports = router;
