import { csrfFetch } from "./csrf";


const GET_ALL_EVENTS = "events/getAllEvents";
const GET_EVENT_DETAILS = "events/getEventDetails";
const GET_GROUP_EVENTS = "events/getGroupEvents";
const CREATE_EVENT = "events/new";
const CREATE_EVENT_IMAGE = "events/image/new";
const DELETE_EVENT = "/events/delet";
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

const createEvent = (event) => {
    return {
        type: CREATE_EVENT,
        event
    }
}

const createEventImage = (image) => {
    return {
        type: CREATE_EVENT_IMAGE,
        image
    }
}

const deleteEvent = (eventId) => {
    return {
        type: DELETE_EVENT,
        eventId: eventId
    }
}

export const getAllEvents = () => async (dispatch) => {
    const response = await fetch(`/api/events`);
    console.log('RESPONSE', response)
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

export const createEventAction = (event, groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: "POST",
        headers: {'Content-Type': 'Application/json'},
        body: JSON.stringify(event)
    });
    if (response.ok) {
        const data = await response.json();
        console.log('HELLO FROM REDUCER',data);
        const singleObject = {
            ...data,
            Group: {
                groupId: data.groupId
            },
            Venue: {
                venueIdL: data.venueId
            },
            EventImages: [],
            Members: [],
            Attendees: []
        }
         dispatch(createEvent(singleObject));
        return data;
    }
}

export const createEventImageAction = (eventId, image) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}/images`, {
        method: "POST",
        headers: {'Content-Type': 'Application/json'},
        body: JSON.stringify(image)
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(createEventImage(image, eventId));
        return data;
    }

}

export const deleteEventAction = (eventId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: "DELETE",
        headers: {'Content-Type': 'Application/json'},
        body: null
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(deleteEvent(eventId));
        return data;
    }
}


// const initialState = { allEvents: {}, singleEvent: {} };
const initialState = {
    allEvents: {

    },

    singleEvent: {

      Group: {

      },

      Venue: {

      },
      EventImages: [],
      Members: [],
      Attendees: [],
    },
  }

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_EVENTS: {
            const newState = {...state};
            action.events.Events.forEach((event) => (newState.allEvents[event.id] = event));
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
        case CREATE_EVENT: {
            const newState = {...state};
            newState.singleEvent = {...action.event};
            return newState;
        }
        case CREATE_EVENT_IMAGE: {
            const newState = {...state};
            newState.singleEvent.EventImages = [action.image, ...state.singleEvent.EventImages];
            return newState;
        }
        case DELETE_EVENT: {
            const newState = {...state};
            newState.singleEvent = {};
            newState.allEvents = {...state.allEvents};
            delete newState.allEvents[action.eventId];
            return newState;
        }
        default: {
            return state;
        }
    }
}

export default eventsReducer
