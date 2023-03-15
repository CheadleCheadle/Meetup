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


// const initalState = {allGroups: {}, singleGroup: {GroupImages: []}, Venues: {}};
const initialState = {
    allGroups: {


    },
    singleGroup: {

      GroupImages: [],
      Organizer: {

      },
      Venues: [],
    },
}


const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_GROUPS: {
            const newState = {...state};
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
            console.log("STATE", newState);
            return newState;
        }
        default:
          return state;
    }
}

export default groupsReducer;
