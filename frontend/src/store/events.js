

const GET_ALL_EVENTS = "events/getAllEvents";
const GET_EVENT_DETAILS = "events/getEventDetails";
const GET_GROUP_EVENTS = "events/getGroupEvents";
const loadEvents = (events) => {
    return {
        type: GET_ALL_EVENTS,
        events
    }
}

const loadEventDetails = (event) => {
    return {
        type: GET_EVENT_DETAILS,
        event
    }
}

const loadGroupEvents = (events) => {
    return {
        type: GET_GROUP_EVENTS,
        events
    }
}

export const getAllEvents = () => async (dispatch) => {
    const response = await fetch(`/api/events`);

    if (response.ok) {
        const data = await response.json();
        console.log("THUNK DATA:", data);
        dispatch(loadEvents(data));
        return data;
    }
}

export const getEventDetails = (id) => async (dispatch) => {
    const response = await fetch(`/api/events/${id}`);
    if (response.ok) {
        const data = await response.json();
        console.log("THE DATA", data);
        dispatch(loadEventDetails(data));
        return data;
    }
}

export const getGroupEvents = (groupId) => async (dispatch) => {
    const response = await fetch(`/api/groups/${groupId}/events`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadGroupEvents(data));
        return data;
    }
}

const initialState = { allEvents: {}, singleEvent: {} }

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_EVENTS: {
            const newState = {...state};
            console.log(`HELLO FROM REDUCER`,action.events.Events);
            action.events.Events.forEach((event) => (newState.allEvents[event.id] = event));
            console.log(newState);
            return newState;
        }
        case GET_EVENT_DETAILS: {
            const newState = {...state};
            newState.singleEvent = {...action.event};
            return newState;
        }
        case GET_GROUP_EVENTS: {
            const newState = {...state};
            newState.allEvents = {};
            action.events.Events.forEach((event) => (newState.allEvents[event.id] = event));
            return newState;
        }
        default: {
            return state;
        }
    }
}

export default eventsReducer
