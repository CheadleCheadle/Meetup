const express = require("express");
const router = require('express').Router();
const { Group, Membership, GroupImage, User, Venue } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
//function to lazy load numMembers and previewImage

//Get All Groups
router.get('/',  async(_req, res) => {
    const groups = await Group.findAll();
    for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        const memberCount = await Membership.count({
            where: {
                groupId: group.id
            }
        });
        const image = await GroupImage.findOne({
            where: {groupId: group.id}
        });
        if (!image) {
            group.dataValues.previewImage = "no image found";
        }
        console.log("                  ", memberCount);
        group.dataValues.numMembers = memberCount;
        group.dataValues.previewImage = image.dataValues.url;
    }

    res.status(200).json({Groups:groups});
});

//Get all Groups joined or organized by the Current User
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    if (user) {
        // const memberships = await Membership.scope('currentUserScope').findAll({
        //     where: {
        //         userId: user.id
        //     },
        //     include: Group
        // });
        const groups = await Group.findAll({
            where: {
                organizerId: user.id
            }
        })

        /*
        How can I query using aggregates to find the COUNT of a groups members?
        */
       for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
       const memberCount = await Membership.count({
        where: {
            groupId: group.id
        }
       });
       const image = await GroupImage.findOne({
            where: {groupId: group.id}
        });
        if (!image) {
            group.dataValues.previewImage = "no image found";
        }
       group.dataValues.numMembers = memberCount;
       group.dataValues.previewImage = image.dataValues.url;
    }

        res.status(200).json({Groups:groups});
    } else {
        res.status(400).json({message: "Not signed in"});
    }

})
//Get details of a Group from an id
router.get('/:groupId', async (req, res) => {
    let { groupId } = req.params
    groupId = +groupId;
    // console.log(typeof groupId);
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
    // console.log(group.dataValues);
    res.status(200).json(group);
    } else {
        res.status(404).json({message: "Group couldn't be found", statusCode: 404});
    }
});
/*
Having trouble creating new membership when creating new group.
Check error and ask a question on Slack.
May have fixed!!!!

*/
//Create New Group
router.post('/', requireAuth, async (req, res) => {
    const {name, about, type, private, city, state } = req.body;
     const { user } = req;
    // try {
    const newGroup = await Group.create({name, about, type, private, city, state, organizerId: user.dataValues.id});
    //create new membership
    // console.log(user.id,  newGroup.dataValues.id);
    // const member = await Membership.create({userId:user.dataValues.id, groupId:newGroup.dataValues.id, status: "Host"});

    //  console.log(member);
    res.status(201).json(newGroup);
    // } catch (e) {
        // console.log(e);
        // res.status(400).json({
        //     message: "Validation Error",
        //     statusCode: 400,
        //     error: {
        //         name: "Name must be 60 characters or less",
        //         about: "About must be 50 characters or more",
        //         type: "Type must be 'Online' or 'In person'",
        //         private: "Private must be a boolean",
        //         city: "City is required",
        //         state: "State is required",
        //         error: e
        //     }
        // })
    // }
});

//Add an Image to a Group based on the Group's id
router.post('/:groupId/images', requireAuth, async (req, res) => {
        const { url, preview } = req.body;
        const { groupId } = req.params;
        const { user } = req;
        const group = await Group.findByPk(groupId);
        if (!group) {
            res.status(404).json({message: "Group couldn't be found", statusCode: 404});
        }
        if (group.organizerId === user.id) {
        const newImage = await GroupImage.create({ groupId, url, preview });
        //to hide certain attributes when sending a response
        //tried to use scopes but didnt work. Need to fix
        res.status(200).json({id: newImage.id, url: newImage.url, preview: newImage.preview});
        } else {
            res.status(403).json({message: "Forbidden request", statusCode: 403});
        }
});

//Edit a group
router.put('/:groupId', requireAuth, async (req, res) => {
    const { name, about, type, private, city, state } = req.body;
    const { groupId } = req.params;
    try {
    const group = await Group.findByPk(groupId);
    if (!group) {
        return res.status(404).json({message: "Group not found", statusCode: 404});
    }
    group.set({
        name,
        about,
        type,
        private,
        city,
        state
    });
    await group.save();
    return res.status(200).json(group);
    } catch (e) {
        return res.status(400).json({
              message: "Validation Error",
              statusCode: 400,
              errors: {
              name: "Name must be 60 characters or less",
              about: "About must be 50 characters or more",
              type: "Type must be 'Online' or 'In person'",
              private: "Private must be a boolean",
              city: "City is required",
              state: "State is required",
              }
        });
    }
});

//Delete a Group

router.delete('/:groupId', requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const { user } = req;

    const group = await Group.findByPk(groupId);

    if (!group) return res.status(404).json({message: "Group couldn't be found", statusCode: 404})

    if (group.organizerId === user.id) {
        await group.destroy();
        return res.status(200).json({message: "Successfully delted", statusCode: 200});
    } else {
        return res.status(403).json({message: "Forbidden request", statusCode: 403});
    }
})



module.exports = router;
