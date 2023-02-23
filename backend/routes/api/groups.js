const express = require("express");
const { route } = require("express/lib/router");
const router = require('express').Router();
const { Group, Membership, GroupImage, User, Venue, Event, Attendance, EventImage} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {  handleCustomValidationErrors } = require('../../utils/validation');
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
        } else {
            groups[i].dataValues.previewImage = null;
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

        for (let i = 0; i < groups.length; i++) {
            const members = await Membership.findAll({
                where: {
                    groupId: groups[i].dataValues.id
                }
            });
            const image = await GroupImage.findOne({
                where: {groupId: groups[i].dataValues.id}
            })
            groups[i].dataValues.numMembers = members.length;
            if (image) {
            groups[i].dataValues.previewImage = image.url;
            } else {
                groups[i].dataValues.previewImage = null;
            }
        }
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

        //try to use build and save
    const newGroup = await Group.create({name, about, type, private, city, state, organizerId: user.dataValues.id});
    const newMember = await Membership.create({userId: user.id, groupId: newGroup.id, status: "host"});
    res.status(201).json(newGroup);
    } catch (e) {
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


//VENUES

//Get All Venues for a Group specified by its id
router.get('/:groupId/venues', requireAuth, async (req, res) => {
    const { user } = req;
    let { groupId } = req.params;
    groupId = parseInt(groupId);

    const membership = await Membership.findOne({
        where: {
            userId: user.id
        }
    })

    const group = await Group.findByPk(groupId);
    if (!group) return res.status(404).json({message: "Group couldn't be found", statusCode: 404});

    if (group.dataValues.id === groupId || membership.dataValues.status === "co-host") {

        const venues = await Venue.findAll({
            where: {
            groupId
            }
        });

        res.status(200).json({
            Venues: venues
        })
    }

});

//Create a new Venue for a Group specified by its id

router.post('/:groupId/venues', requireAuth, async (req, res) => {
    const { user } = req;
    let { groupId } = req.params
    groupId = parseInt(groupId);

    const group = await Group.findOne({
        where: {
            id: groupId
        }
    })
    if (!group) {
          return res.status(404).json({message: "Group couldn't be found", statusCode: 404});
    }

    const { address, city, state, lat, lng } = req.body;

     const membership = await Membership.findOne({
        where: {
            userId: user.id
        }
    })
    if (!membership) return res.json({message: "my custom erro"});
    if (membership.dataValues.groupId = groupId || membership.dataValues.status === "co-host") {
        const newVenue = await Venue.create({ groupId, address, city, state, lat, lng });
        return res.status(200).json(newVenue);
    }
});
//Get all Events of a Group specified by its id
router.get('/:groupId/events', async (req, res) => {

    let { groupId } = req.params;
    groupId = parseInt(groupId);

    const group = await Group.findOne({
        where: {
            id: groupId
        }
    })
    if (!group) res.status(404).json({message: "Group couldn't be found", statusCode: 404});

    const events = await Event.findAll({
        where: {
            groupId
        },
    attributes: {
        exclude: ["capacity", "price"]
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
    }
    delete event.dataValues.Group.dataValues.organizerId;
    delete event.dataValues.Group.dataValues.type;
    delete event.dataValues.Group.dataValues.about;
    delete event.dataValues.Group.dataValues.private;
    delete event.dataValues.Venue.dataValues.groupId;
    delete event.dataValues.Venue.dataValues.address;
    delete event.dataValues.Venue.dataValues.lat;
    delete event.dataValues.Venue.dataValues.lng;
}
res.status(200).json({Events:events});
});
//Create an Event by Group Id
router.post('/:groupId/events', requireAuth, async (req, res) => {
    const { user } = req;
    let { groupId } = req.params;
    groupId = parseInt(groupId);

    const { venueId, name, type, capacity, price, description, startDate, endDate} = req.body;

    const membership = await Membership.findOne({
        where: {
            userId: user.id
        }
    });

    const group = await Group.findByPk(groupId);
    if (!group) res.status(404).json({message: "Group couldn't be found", statusCode: 404});

    if (membership.userId === group.organizerId || membership.status === "co-host") {
        const newEvent = await Event.create({ venueId, groupId, name, type, capacity, price, description, startDate, endDate });
        await Attendance.create({eventId: newEvent.dataValues.id, userId: user.id, status: "host"});
        delete newEvent.dataValues.createdAt;
        delete newEvent.dataValues.updatedAt;
        res.status(200).json(newEvent);
    }
});

//Get all Members of a Group specified by its id

router.get('/:groupId/members', async (req, res) => {
    const { user } = req;
    let { groupId } = req.params;
    groupId = parseInt(groupId);
    //EAGER LOADING MAY BREAK IN PRODUCTION!
    const group = await Group.findByPk(groupId);

    if (!group) return res.status(404).json({message: "Group couldn't be found"});
    const groupMembers = await Membership.findAll({
        where: {
            groupId
        },
        include: User
    });
    const currentMembership = await Membership.findOne({
        where: {
            userId: user.id
        }
    })
    // if (!currentMembership) res.json({message: "my custom error"});
    if (group.dataValues.organizerId === user.id || currentMembership.status === "co-host") {
    let members= [];
    for (let i = 0; i < groupMembers.length; i++) {
        let membership = groupMembers[i];
        let member = {};
        member.id = membership.dataValues.User.dataValues.id;
        member.firstName = membership.dataValues.User.dataValues.firstName;
        member.lastName = membership.dataValues.User.dataValues.lastName;
        member.Membership = {status: membership.dataValues.status};
        members.push(member);
    }
    return res.status(200).json({Members: members});
} else if (group.dataValues.organizer !== user.id) {
    let otherMembers = [];
    for (let i = 0; i < groupMembers.length; i++) {
        const membership = groupMembers[i];
        if (membership.dataValues.status !== "pending") {
            let member = {};
        member.id = membership.dataValues.User.dataValues.id;
        member.firstName = membership.dataValues.User.dataValues.firstName;
        member.lastName = membership.dataValues.User.dataValues.lastName;
        member.Membership = {status: membership.dataValues.status};
        otherMembers.push(member);
        }
    }
    return res.status(200).json({Members: otherMembers});
}
});

//Request a Membership for a Group based on the Group's id
router.post('/:groupId/membership', requireAuth, async (req, res) => {
    const { user } = req;
    let { groupId } = req.params;
    groupId = parseInt(groupId);
    let { memberId, status } = req.body;
    memberId = parseInt(memberId);
    const group = await Group.findByPk(groupId);
    const membershipCheck = await Membership.findOne({
        where: {
            userId: memberId,
            groupId
        }
    });
    if (!group) return res.status(404).json({message: "Group couldn't be found", statusCode: 404});

    if (!membershipCheck) {
        const pendingMember = await Membership.create( {userId: memberId, groupId, status});
        return res.status(200).json(pendingMember);

    } else if (membershipCheck.dataValues.status === "pending") {
        return res.status(400).json({message: "Membership has already been requested", statusCode: 400})
    } else if (membershipCheck) {
        return res.status(400).json({message: "User is already a member of the group", statusCode: 400});
    }

});
//Change the status of a membership for a group specified by id

router.put('/:groupId/membership', requireAuth, async (req, res) => {
    let { groupId } = req.params;
    groupId = parseInt(groupId);
    const { user } = req;
    let { memberId, status } = req.body
    memberId = parseInt(memberId);
    const currentMembership = await Membership.findOne({
        where: {
            userId: user.id
        }
    });

    const group = await Group.findByPk(groupId);
    const membership = await Membership.findOne({
        where: {
            id : memberId
        },
        attributes: ["id", "status", "userId", "groupId"]
    });
    console.log(memberId, typeof memberId);
    console.log(membership);


    if (!group) {
        return res.status(404).
        json({message: "Group couldn't be found", statusCode: 404});
    }

    if (!membership) {
        return res.status(400).
        json({message: "Membership between the user and the group does not exists", statusCode: 400});
    }

    if (!membership.userId) {
        return res.status(400).
        json({message: "Validation Error", statusCode:400, errors: {memberId: "User couldn't be found"}});
    }
    if (status === "pending") {
        return res.status(400).
        json({message: "Validation Error", statusCode: 400, errors: {status: "Cannot change a membership status to pending"}});
    }

    if (currentMembership.status === "co-host" || group.dataValues.organizerId === user.id) {
        if (status === "member") {
            membership.set( { status } );
            membership.save();
            return res.status(200).json(membership);
        } else if (status === "co-host" && group.dataValues.organizerId === user.id) {
            membership.set({ status });
            membership.save();
            return res.status(200).json(membership);
        }
    } else {
        res.status(400).json({message: "my custom error"});
    }
});

router.delete('/:groupId/membership', requireAuth, async (req, res) => {
    const { user } = req;
    let { groupId } = req.params;
    let { memberId } = req.body;
    memberId = parseInt(memberId);
    groupId = parseInt(groupId);
    const membershipToDelete = await Membership.findOne({
        where: {
            userId: memberId
        }
    });
    const currentMembership = await Membership.findOne({
        where: {
            userId: user.id
        }
    });
    const group = await Group.findByPk(groupId);
    if (!group) {
        res.status(404).json({message: "Group couldn't be found", statusCode: 404});
    }
    if (!membershipToDelete) {
        res.status(400).json({message: "Validation Error", statusCode: 400, errors: {memberId: "User couldn't be found"}});
    }
    if (!currentMembership) {
        res.status(404).json({message: "Membership does not exist for this User", statusCode: 404});
    }

    // const group = await Group.findByPk(groupId);

    if (currentMembership.dataValues.status === "host" || membershipToDelete.dataValues.userId === user.id) {
        await currentMembership.destroy();
        res.status(200).json({message: "Successfully deleted membership from group"});
    }
})





module.exports = router;
