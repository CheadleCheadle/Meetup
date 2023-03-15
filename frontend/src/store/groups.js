import { detect } from 'underscore';
import { csrfFetch } from './csrf';
const GET_ALL_GROUPS = "groups/getAllGroups";
const GET_GROUP_DETAILS = "groups/details";
const CREATE_GROUP = "/groups/new";
const CREATE_GROUP_IMAGE = "/groups/image";
const UPDATE_GROUP = "/groups/edit"
const UPDATE_GROUP_IMAGE = "/groups/image/edit"
const DELETE_GROUP = "/groups/delete";
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

const createGroupImage = (image, groupId) => {
    return {
        type: CREATE_GROUP_IMAGE,
        image,
        groupId:groupId
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
        console.log('FETCHED DATA',data);
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

        console.log('GROUP', data);

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
        dispatch(createGroupImage(data, groupId));
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
        console.log('returned Data', data);
        return data;
    }
}


const initalState = {allGroups: {}, singleGroup: {GroupImages: []}, Venues: {}};


const groupsReducer = (state = initalState, action) => {
    switch (action.type) {
        case GET_ALL_GROUPS: {
            const newState = {};
            action.groups.Groups.forEach((group) => (newState[group.id] = group));
            // console.log('STATE', newState)
            return newState;
        }
        case GET_GROUP_DETAILS: {
            const newState = {...state};
            newState.singleGroup = {...action.group};
            // console.log('Group Details',newState.singleGroup);
            // console.log('NEW STATE',newState);
            return newState;
        }
        case CREATE_GROUP: {
            const newState = {...state};
            // console.log('STATE',newState.allGroups);
            // newState.allGroups[action.group.id] = action.group;
            newState.singleGroup = {...action.group};
            return newState;
        }
        case CREATE_GROUP_IMAGE: {
            const newState = {...state};
            newState.singleGroup.GroupImages.push(action.image);
            // newState.singleGroup.GroupImages.push(action.image);
            return newState;
        }
        case UPDATE_GROUP: {
            const newState = {...state};
            // newState.singleGroup.GroupImages = {...state.singleGroup.GroupImages}
            // newState.singleGroup = {...action.group};
            // newState.singleGroup.GroupImages = [...]
            return newState;
        }
        case UPDATE_GROUP_IMAGE: {
            // console.log("Image State", state)
            const newState = {...state};
            // const imageToUpdate = newState.singleGroup.GroupImages.find((image) => image.id === action.image.id);
            // console.log('image to update', imageToUpdate);
            newState.singleGroup.GroupImages[action.image.id] = {...action.image};
            return newState;
        }
        case DELETE_GROUP: {
            console.log('Current State',state);
            const newState = {...state};
            // newState.singleGroup = {};
            console.log(action.groupId);
            // console.log("Events before deletion", newState);
            delete newState.allGroups.action.groupId;
            // console.log("Events after deletion", newState);
            return newState;
        }
        default:
            console.log('hitting default');
          return state;
    }
}

export default groupsReducer;
