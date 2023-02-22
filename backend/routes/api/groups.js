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
         console.log(groups[0].dataValues);
    //     if (Membership && GroupImage){
    //     for (let i = 0; i < groups.length; i++) {
    //         const members = await Membership.findAll({
    //             where: {
    //                 groupId: groups[i].dataValues.id
    //             }
    //         });
    //         const image = await GroupImage.findOne({
    //             where: {groupId: groups[i].dataValues.id}
    //         })
    //         groups[i].dataValues.numMembers = members.length;
    //         groups[i].dataValues.previewImage = image.url;
    //     }
    // }
        //  console.log(memberships[0].Group.dataValues);
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

router.post('/', requireAuth, async (req, res) => {
    const {name, about, type, private, city, state } = req.body;
    const { user } = req;
    try {
    const newGroup = await Group.create({name, about, type, private, city, state, organizerId: user.dataValues.id});
    //create new membership
    // console.log(user.id,  newGroup.dataValues.id);
    const member = await Membership.create({userId:user.dataValues.id, groupId:newGroup.dataValues.id, status: "Host"});

    // console.log('               ', member);
    res.status(201).json(newGroup);
    } catch (e) {
        console.log(e);
        res.status(400).json({
            message: "Validation Error",
            statusCode: 400,
            error: {
                name: "Name must be 60 characters or less",
                about: "About must be 50 characters or more",
                type: "Type must be 'Online' or 'In person'",
                private: "Private must be a boolean",
                city: "City is required",
                state: "State is required",
                error: e
            }
        })
    }
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
