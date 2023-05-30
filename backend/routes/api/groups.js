const express = require("express");
const { route } = require("express/lib/router");
const { escapeRegExp } = require("lodash");
const router = require('express').Router();
const { Op } = require('sequelize');
const { Group, Membership, GroupImage, User, Venue, Event, Attendance, EventImage} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {  handleValidationErrors } = require('../../utils/validation');
const { validateGroupBody, validateVenueBody, validateEventBody, validateMemberBody } = require('../../utils/body-validation');
const { singleMulterUpload, singlePublicFileUpload } = require("../../awsS3");
//Get All Groups
router.get('/',  async(req, res) => {
    const groups = await Group.findAll({
        include: [{
            model: Event,
            attributes: {
                exclude: ["name", "description", "venueId", "type", "private", "capacity", "price", "startDate", "endDate", "createdAt", "updatedAt", "groupId"]
            }
        }]
    });
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

        const groups = await Group.findAll({
            where: {
                organizerId: user.id
            }
        })
        //To find all the groups that the current user is a part of excluding hosted groups
        const memberships = await Membership.findAll({
            where: {
                userId: user.id,
                status: {
                    [Op.ne]: "host"
                }
            },
            include: {model: Group, as: "Members"}
        })



        memberships.forEach(membership => {
            groups.push(membership.dataValues.Members);
        })

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
        res.status(200).json({Groups:groups});
    } else {
        res.status(400).json({message: "Not signed in"});
    }

})
//Get details of a Group from an id
router.get('/:groupId', async (req, res) => {
    let { groupId } = req.params
    groupId = +groupId;

    const group = await Group.scope('getDetailsOfGroup').findOne({
        where: {id: groupId},
        include: [{
            model:GroupImage,
            attributes: {
                exclude: ["groupId", "createdAt", "updatedAt"]
            }
        }, Venue, {
            model: Event,
            attributes: {
                exclude: ["name", "description", "createdAt", "updatedAt", "venueId", "type", "price", "private", "capacity", "startDate", "endDate"]
            }
        }]
    });
    if (!group) {
         return res.status(404).json({message: "Group couldn't be found", statusCode: 404});
    }
    const organizer = await User.scope('getGroupDetails').findOne({
        where: {id: group.dataValues.organizerId}
    })

    const groupMembers = await Membership.findAll({
        where: {
            groupId: group.id
        }
    });
    group.dataValues.numMembers = groupMembers.length;
    group.dataValues.Organizer = organizer;

    return res.status(200).json(group);

});
//Create a group
router.post('/', [requireAuth, validateGroupBody], async (req, res) => {
    const {name, about, type, private, city, state } = req.body;
    const { user } = req;
    try {


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
router.post('/:groupId/images', requireAuth, singleMulterUpload("image"), async (req, res) => {
    // const {preview } = req.body;
    const { groupId } = req.params;
    // console.log('---------------------------', req.file, req);
    const url = await singlePublicFileUpload(req.file);

    console.log("url--------------------", url);
    const { user } = req;
        const group = await Group.findByPk(groupId);
        if (!group) {
            return res.status(404).json({message: "Group couldn't be found", statusCode: 404});
        }
        if (group.organizerId === user.id) {
        const newImage = await GroupImage.create({ groupId, url, preview:true });
        res.status(200).json({id: newImage.id, url: newImage.url, preview: newImage.preview});
        } else {
            res.status(403).json({message: "Forbidden", statusCode: 403});
        }
});

//Edit a group
router.put('/:groupId', [requireAuth, validateGroupBody], async (req, res) => {
    const { name, about, type, private, city, state } = req.body;
    let { groupId } = req.params;
    groupId = parseInt(groupId);
    const { user } = req;

    const group = await Group.findByPk(groupId);
    if (!group) {
        return res.status(404).json({message: "Group not found", statusCode: 404});
    }
    if (group.dataValues.organizerId === user.id) {
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
} else {
    res.status(403).json({message: "Forbidden", statusCode: 403});
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
        return res.status(403).json({message: "Forbidden", statusCode: 403});
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
            userId: user.id,
            groupId
        }
    })

    const group = await Group.findByPk(groupId);

    if (!group) return res.status(404).json({message: "Group couldn't be found", statusCode: 404});

    if (!membership) {
        return res.status(403).json({message: "Forbidden", statusCode: 403});
    }
    if (group.dataValues.organizerId === user.id || membership.dataValues.status === "co-host") {

        const venues = await Venue.findAll({
            where: {
            groupId
            }
        });

        res.status(200).json({
            Venues: venues
        })
    } else {
        return res.status(403).json({message: "Forbidden", statusCode:403});
    }

});

//Create a new Venue for a Group specified by its id

router.post('/:groupId/venues', [requireAuth, validateVenueBody], async (req, res) => {
    const { user } = req;
    let { groupId } = req.params
    groupId = parseInt(groupId);
    const { address, city, state, lat, lng } = req.body;

    const group = await Group.findOne({
        where: {
            id: groupId
        }
    })
    if (!group) {
          return res.status(404).json({message: "Group couldn't be found", statusCode: 404});
    }



     const membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId
        }
    })

    if (!membership) return res.json({message: "Forbidden", statusCode: 403});
    if (user.id === group.dataValues.organizerId || membership.dataValues.status === "co-host") {
        const newVenue = await Venue.create({ groupId, address, city, state, lat, lng });
        delete newVenue.dataValues.createdAt;
        delete newVenue.dataValues.updatedAt;
        return res.status(200).json(newVenue);
    } else {
        res.status(403).json({message: "Forbidden", statusCode: 403});
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
    include: ["Group", {
        model: Venue,
        attributes: {
            exclude: ["groupId", "address", "lat", "lng"]
        }
    }]
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
    event.dataValues.numAttending = numAttend;
    if (image) {
    event.dataValues.previewImage = image.url;
    }

    delete event.dataValues.Group.dataValues.organizerId;
    delete event.dataValues.Group.dataValues.createdAt;
    delete event.dataValues.Group.dataValues.updatedAt;
    delete event.dataValues.Group.dataValues.type;
    delete event.dataValues.Group.dataValues.about;
    delete event.dataValues.Group.dataValues.private;


}
res.status(200).json({Events:events});
});
//Create an Event by Group Id
router.post('/:groupId/events', [requireAuth], async (req, res) => {
    const { user } = req;
    let { groupId } = req.params;
    groupId = parseInt(groupId);

    const { venueId, name, type, capacity, price, description, startDate, endDate, private} = req.body;

    const group = await Group.findByPk(groupId);
    if (!group) res.status(404).json({message: "Group couldn't be found", statusCode: 404});

    const membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId
        }
    });
    if (!membership) return res.json({message: "Forbidden", statusCode: 403});

    if (membership.userId === group.organizerId || membership.status === "co-host") {
        try {
            const newEvent = await Event.create({ venueId, groupId, name, type, capacity, price, description, startDate, endDate, private });
            await Attendance.create({eventId: newEvent.dataValues.id, userId: user.id, status: "host"});
            delete newEvent.dataValues.createdAt;
            delete newEvent.dataValues.updatedAt;
            res.status(200).json(newEvent);
        } catch (error) {
            console.log("IM CATCHING THE ERRORS")
            res.status(400).json({errors: error});
        }
    } else {
        return res.status(403).json({message: "Forbidden", statusCode: 403});
    }
});

//Get all Members of a Group specified by its id

router.get('/:groupId/members', async (req, res) => {
    const { user } = req;
    let { groupId } = req.params;
    groupId = parseInt(groupId);

    const group = await Group.findByPk(groupId);

    if (!group) return res.status(404).json({message: "Group couldn't be found"});
    const groupMembers = await Membership.findAll({
        where: {
            groupId
        },
        include: User
    });
    let currentMembership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId
        }
    })
    if (!currentMembership) {
        currentMembership = await Membership.findOne({where: {userId: user.id}});
    }

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

            let member = {};
        member.id = membership.dataValues.User.dataValues.id;
        member.firstName = membership.dataValues.User.dataValues.firstName;
        member.lastName = membership.dataValues.User.dataValues.lastName;
        member.Membership = {status: membership.dataValues.status};
        otherMembers.push(member);

    }
    return res.status(200).json({Members: otherMembers});
}
});

//Request a Membership for a Group based on the Group's id
router.post('/:groupId/membership', requireAuth, async (req, res) => {
    const { user } = req;
    let { groupId } = req.params;
    groupId = parseInt(groupId);

    const group = await Group.findByPk(groupId);
    const membershipCheck = await Membership.findOne({
        where: {
            userId: user.id,
            groupId
        }
    });

    if (!group) return res.status(404).json({message: "Group couldn't be found", statusCode: 404});

    if (!membershipCheck) {
        const pendingMember = await Membership.create( {userId: user.id, groupId, status: 'pending'});
        delete pendingMember.dataValues.groupId;
        delete pendingMember.dataValues.updatedAt;
        delete pendingMember.dataValues.createdAt;
        delete pendingMember.dataValues.userId;
        delete pendingMember.dataValues.id;

        pendingMember.dataValues.memberId = user.id
        return res.status(200).json(pendingMember);

    } else if (membershipCheck.dataValues.status === "pending") {
        return res.status(400).json({message: "Membership has already been requested", statusCode: 400})
    } else if (["host", "co-host", "member"].includes(membershipCheck.dataValues.status.toLowerCase())) {
        return res.status(400).json({message: "User is already a member of the group", statusCode: 400});
    }

});
//Change the status of a membership for a group specified by id

router.put('/:groupId/membership', [requireAuth, validateMemberBody], async (req, res) => {
    let { groupId } = req.params;
    groupId = parseInt(groupId);
    const { user } = req;
    console.log("-----------", groupId, user)
    let { memberId, status } = req.body
    memberId = parseInt(memberId);
    const userToFind = await User.findByPk(memberId);
    const membershipToFind = await Membership.findOne({
        where: {
            userId: memberId,
            groupId
        },
        attributes: ["id", "status", "userId", "groupId"]

    })

        const group = await Group.findByPk(groupId);
        if (!group) {
        return res.status(404).
        json({message: "Group couldn't be found", statusCode: 404});
    }


    const currentMembership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId
        },
    });
    if (!currentMembership) {
         return res.status(403).json({message: "Forbidden", statusCode: 403});
    }

           if (!userToFind) {
        res.status(400).json({
        message: "Validation Error",
        statusCode: 400,
        errors: {
        memberId: "User couldn't be found"
  }
})
    }


    if (status === "member" && (group.dataValues.organizerId !== user.id && currentMembership.status !== "co-host")) {
        return res.status(403).json({message: "Forbidden", statusCode: 403});
    }
    if (status === "co-host" && group.dataValues.organizerId !== user.id) {
        return res.status(403).json({message: "Forbidden", statusCode: 403});
    }


       if (!userToFind) {
        res.status(400).json({
        message: "Validation Error",
        statusCode: 400,
        errors: {
        memberId: "User couldn't be found"
  }
})
    }

    if (status === "pending") {
        return res.status(400).json({
        message: "Validations Error",
        statusCode: 400,
        errors: {
        status : "Cannot change a membership status to pending"
        }
  })
    }
    if (!membershipToFind) {
        return res.status(404).json({message: "Membership between the user and the group does not exists", statusCode: 404});
    }

    if (currentMembership.dataValues.status === "co-host" || group.dataValues.organizerId === user.id) {
        membershipToFind.set({ status });
        membershipToFind.save();
        delete membershipToFind.dataValues.updatedAt
        return res.status(200).json(membershipToFind);
    }

});
//Delete a membership to a group by id
router.delete('/:groupId/membership/delete', requireAuth, async (req, res) => {
    const { user } = req;
    let { groupId } = req.params;
    let { memberId } = req.body;
    memberId = parseInt(memberId);
    groupId = parseInt(groupId);
    const currentUser = await User.findByPk(memberId);

    const membershipToDelete = await Membership.findOne({
        where: {
            userId: memberId,
            groupId
        }
    });
    const currentMembership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId
        }
    });
    const group = await Group.findByPk(groupId);

    if (!group) {
        return res.status(404).json({message: "Group couldn't be found", statusCode: 404});
    }

    if (!currentMembership) {
        return res.status(403).json({message: "Forbidden", statusCode: 403});
    }
    if (group.organizerId !== user.id && membershipToDelete.userId !== user.id) {
        return res.status(403).json({message: "Forbidden", statusCode: 403});
    }

    if (!currentUser) {
        return res.status(400).json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
            memberId: "User couldn't be found"
            }
})
    }


    if (!membershipToDelete) {
        return res.status(404).json({message: "Membership does not exist for this User", statusCode: 404});
    }
    if (membershipToDelete.dataValues.userId === user.id) {
        await membershipToDelete.destroy();
        return res.status(200).json({message: "Successfully deleted membership from group"});
    } else if (currentMembership.dataValues.status === "host") {
        await membershipToDelete.destroy();
        return res.status(200).json({message: "Successfully deleted membership from group"});
    } else {
        return res.status(400).json({message: "Forbidden request123", status: 400});
    }
})





module.exports = router;
