import { csrfFetch } from './csrf';
import normalize from './normalize';
const GET_ALL_GROUPS = "groups/getAllGroups";
const GET_GROUP_DETAILS = "groups/details";
const CREATE_GROUP = "/groups/new";
const CREATE_GROUP_IMAGE = "/groups/image";
const UPDATE_GROUP = "/groups/edit"
const UPDATE_GROUP_IMAGE = "/groups/image/edit"
const DELETE_GROUP = "/groups/delete";
const GET_MEMBERS = "groups/members";
const JOIN_GROUP = "groups/join";
const UPDATE_MEMBER = "groups/membership/update";
const DELETE_MEMBER = "groups/membership/delete";


const loadGroups = (groups) => {
    return {
        type: GET_ALL_GROUPS,
        groups
    }
}

const loadGroupDetails = (group) => {
    return {
        type: GET_GROUP_DETAILS,
        group
    }
}

const createGroup = (group) => {
    return {
        type: CREATE_GROUP,
        group,

    }
}

const createGroupImage = (image) => {
    return {
        type: CREATE_GROUP_IMAGE,
        image
    }
}

const updateGroup = (group) => {
    return {
        type: UPDATE_GROUP,
        group
    }
}

const updateGroupImage = (image) => {
    return {
        type: UPDATE_GROUP_IMAGE,
        image

    }
}

const deleteGroup = (groupId) => {
    return {
        type: DELETE_GROUP,
        groupId: groupId
    }
}

const getMembers = (members) => {
    return {
        type: GET_MEMBERS,
        members
    }
}

const joinGroup = (member) => {
    return {
        type: JOIN_GROUP,
        member
    }
}

const updateMembership = (status, memberId) => {
    return {
        type: UPDATE_MEMBER,
        status,
        memberId
    }
}

const deleteMembership = (groupId, memberId) => {
    return {
        type: DELETE_MEMBER,
        groupId,
        memberId
    }
}

export const updateMembershipThunk = (userId, memberId, groupId, status) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
        method: "PUT",
        headers: {"Content-Type": "Application/json"},
        body: JSON.stringify({
            memberId: userId,
            status
        })
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(updateMembership(status, userId))
        console.log('Updted membership', data);
    }

}

export const deleteMembershipThunk = (groupId, userId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}/membership/delete`, {
        method: "DELETE",
        headers: {"Content-Type": "Application/json"},
        body: JSON.stringify({
            memberId: userId
        })
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(deleteMembership(groupId, userId))
        console.log("deleted",data );
    }
}


export const getAllGroups = () => async (dispatch) => {
    const response = await fetch('/api/groups');

    if (response.ok) {
        const data = await response.json();
        dispatch(loadGroups(data));
        return data;
    }
}

export const getGroupDetails = (id) => async (dispatch) => {
    const response = await fetch(`/api/groups/${id}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getGroupMembers(id));
        dispatch(loadGroupDetails(data));
        return data;
    }
}

export const createGroupAction = (group) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/`, {
        method: "POST",
        headers: {'Content-Type': 'Application/json'},
        body: JSON.stringify(group)
    });
    if (response.ok) {
        const data = await response.json();


        const singleObject = {
            ...data,
            GroupImages: [],
            Organizer: {
                organizerId: data.organizerId
            },
            Venues: null
        }
        dispatch(createGroup(singleObject));
        return data;
    }
}

export const createGroupImageAction = (groupId, image) => async (dispatch) => {
        const imageResponse = await csrfFetch(`/api/groups/${groupId}/images`, {
        method: "POST",
        headers: {'Content-Type': 'Application/json'},
        body: JSON.stringify(image)
    });
    if (imageResponse.ok) {
        const data = await imageResponse.json();
        dispatch(createGroupImage(data));
        return data;
    }
}

export const updateGroupAction = (group, groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: "PUT",
        headers: {'Content-Type': 'Application/json'},
        body: JSON.stringify(group)
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(updateGroup(data));
        return data;
    }
}

export const updateGroupImageAction = (imageId, image) => async (dispatch) => {
    const imageResponse = await csrfFetch(`/api/group-images/${imageId}`, {
        method: "PUT",
        headers: {'Content-Type': 'Application/json'},
        body: JSON.stringify(image)
    });

    if (imageResponse.ok) {
        const data = await imageResponse.json();
        dispatch(updateGroupImage(data));
        return data;
    }

}

export const deleteGroupAction = (groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: "DELETE",
        headers: {'Content-Type': 'Application/json'},
        body: null
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(deleteGroup(groupId));
        return data;
    }
}

export const getGroupMembers = (groupId) => async  (dispatch) => {
    console.log('THIS IS THE GROUPID', groupId);
    const response = await csrfFetch(`/api/groups/${groupId}/members`);

    if (response.ok) {
        const data = await response.json();
        const members = normalize(data.Members);
        dispatch(getMembers(members))
    }
}

export const joinGroupThunk = (groupId, user) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
        method: "POST",
        headers: {'Content-Type': 'Application/json'},
        body: null
    });

    if (response.ok) {
        const data = await response.json();
        const userObject = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            Membership: {status: data.status}
        };
        dispatch(joinGroup(userObject));
        console.log("NEw membership", userObject);
    }
}



// const initalState = {allGroups: {}, singleGroup: {GroupImages: []}, Venues: {}};
const initialState = {
    allGroups: {


    },
    singleGroup: {

      GroupImages: [],
      Organizer: {

      },
      Venues: [],
      members: {},
    },
}


const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_GROUPS: {
            const newState = {...state, allGroups: {}};
            action.groups.Groups.forEach((group) => (newState.allGroups[group.id] = group));
            return newState;
        }
        case GET_GROUP_DETAILS: {
            const newState = {...state};
            newState.singleGroup = {...action.group};
            return newState;
        }
        case CREATE_GROUP: {
            const newState = {...state};
            newState.singleGroup = {...action.group};
            return newState;
        }
        case CREATE_GROUP_IMAGE: {
            const newState = {...state};
            newState.singleGroup.GroupImages = [action.image, ...state.singleGroup.GroupImages];
            return newState;
        }
        case UPDATE_GROUP: {
            const newState = {...state};
            newState.singleGroup = {...state.singleGroup};
            newState.singleGroup.name = action.group.name;
            newState.singleGroup.location = action.group.location;
            newState.singleGroup.about = action.group.about;
            newState.singleGroup.type = action.group.type;
            newState.singleGroup.private = action.group.private;
            return newState;
        }
        case UPDATE_GROUP_IMAGE: {
            const newState = {...state};
            newState.singleGroup.GroupImages = [...state.singleGroup.GroupImages];
            newState.singleGroup.GroupImages.forEach(image => {
                if (image.id === action.image.id) {
                    image.url = action.image.url;
                }
            });
            return newState;
        }
        case DELETE_GROUP: {
            const newState = {...state};
            newState.singleGroup = {};
            newState.allGroups = {...state.allGroups};
            delete newState.allGroups[action.groupId];
            return newState;
        }
        case GET_MEMBERS: {
            const newState = {
                ...state,
                singleGroup: {
                    ...state.singleGroup,
                    members: {...action.members}
                }
            }
            return newState;

        }
        case JOIN_GROUP: {
            const newState = {
                ...state,
                singleGroup: {
                    ...state.singleGroup,
                    members: {
                        ...state.singleGroup.members,
                        [action.member.id]: action.member
                    }
                }
            }
            return newState;
        }

        case UPDATE_MEMBER: {
            const newState = {
                ...state,
                singleGroup: {
                    ...state.singleGroup,
                    members: {...state.singleGroup.members,}
                }
            }
            newState.singleGroup.members[action.memberId].Membership.status = action.status;
            return newState;
        }
        case DELETE_MEMBER: {
            const newState = {
                ...state,
                singleGroup: {
                    ...state.singleGroup,
                    members: {...state.singleGroup.members}
                }
            };
            delete newState.singleGroup.members[action.memberId];
            return newState;
        }
        default:
          return state;
    }
}

export default groupsReducer;
