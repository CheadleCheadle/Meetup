const express = require("express");
const router = require('express').Router();
const { Group, Membership, GroupImage, User, Venue } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
//Get All Groups
//function to lazy load numMembers and previewImage
// const getMembersAndImage = async (arr)  => {

//     for (let i = 0; i < arr.length; i++) {
//         const members = await Membership.findAll({
//             where: {groupId: arr[i].id}
//         })
//         const image = await GroupImage.findOne({
//             where: {groupId : arr[i].id}
//         })
//         arr[i].dataValues.numMembers = members.length;

//         if (image) {
//         arr[i].dataValues.previewImage = image.url
//         }


//     }

// }
router.get('/',  async(req, res) => {
    const groups = await Group.findAll();

    for (let i = 0; i < groups.length; i++) {
        const members = await Membership.findAll({
            where: {groupId: groups[i].id}
        })
        const image = await GroupImage.findOne({
            where: {groupId : groups[i].id}
        })
        groups[i].dataValues.numMembers = members.length;

        if (image) {
        groups[i].dataValues.previewImage = image.url
        }


    }
    res.status(200).json({Groups:groups});
});

//Get all Groups joined or organized by the Current User
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    if (user) {
        const memberships = await Membership.scope('currentUserScope').findAll({
            where: {
                userId: user.id
            },
            include: Group
        });
        console.log(memberships[0].dataValues.Group);

        for (let i = 0; i < memberships.length; i++) {
            const members = await Membership.findAll({
                where: {
                    groupId: memberships[i].dataValues.Group.id
                }
            });
            const image = await GroupImage.findOne({
                where: {groupId: memberships[i].dataValues.Group.id}
            })
            memberships[i].dataValues.Group.dataValues.numMembers = members.length;
            memberships[i].dataValues.Group.dataValues.previewImage = image.url;
        }
         console.log(memberships[0].Group.dataValues);
        res.status(200).json(memberships);
    } else {
        res.status(400).json({message: "Not signed in"});
    }

})
//Get details of a Group from an id
router.get('/:groupId', async (req, res) => {
    let { groupId } = req.params
    groupId = +groupId;
    console.log(typeof groupId);
    const group = await Group.findOne({
        where: {id: groupId},
        include: [GroupImage, Venue,]
    });
    if (group) {
    // console.log(group);
    const organizer = await User.scope('getGroupDetails').findOne({
        where: {id: group.dataValues.organizerId}
    })
    group.dataValues.Organizer = organizer;
    console.log(group.dataValues);
    res.status(200).json(group);
    } else {
        res.status(404).json({message: "Group couldn't be found", statusCode: 404});
    }
})



module.exports = router;
