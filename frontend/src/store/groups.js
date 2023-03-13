const GET_ALL_GROUPS = "groups/getAllGroups";
const GET_GROUP_DETAILS = "groups/details";


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

const initalState = {allGroups: {}, singleGroup: {}, Venues: {}};


const groupsReducer = (state = initalState, action) => {
    switch (action.type) {
        case GET_ALL_GROUPS: {
            const newState = {};
            action.groups.Groups.forEach((group) => (newState[group.id] = group));
            console.log('STATE', newState)
            return newState;
        }
        case GET_GROUP_DETAILS: {
            const newState = {...state};
            newState.singleGroup = {...action.group};
            console.log('NEW STATE',newState);
            return newState;
        }
        default:
          return state;
    }
}

export default groupsReducer;
