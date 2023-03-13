const GET_ALL_GROUPS = "groups/getAllGroups";

const loadGroups = (groups) => {
    return {
        type: GET_ALL_GROUPS,
        groups
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

const initalState = {allGroups: {}, singleGroup: {}, Venues: {}};


const groupsReducer = (state = initalState, action) => {
    switch (action.type) {
        case GET_ALL_GROUPS: {
            const newState = {};
            console.log(`THIS IS MY ACTION`,action);
            action.groups.Groups.forEach((group) => (newState[group.id] = group));
            return newState;
        }
        default:
          return state;
    }
}

export default groupsReducer;
