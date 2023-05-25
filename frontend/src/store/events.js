import { csrfFetch } from "./csrf";
import normalize from "./normalize";


const GET_ALL_EVENTS = "events/getAllEvents";
const GET_EVENT_DETAILS = "events/getEventDetails";
const GET_GROUP_EVENTS = "events/getGroupEvents";
const CREATE_EVENT = "events/new";
const CREATE_EVENT_IMAGE = "events/image/new";
const DELETE_EVENT = "/events/delete";
const UPDATE_EVENT = "/events/edit";
const UPDATE_EVENT_IMAGE = "/eventImages/edit";

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

const updateEvent = (event) => {
    return {
        type: UPDATE_EVENT,
        event
    }
}

const updateEventImage = (image) => {
    return {
        type: UPDATE_EVENT_IMAGE,
        image
    }
}
export const getAllEvents = () => async (dispatch) => {
    const response = await fetch(`/api/events`);
    if (response.ok) {
        const data = await response.json();
        console.log("events", data);
        const events = normalize(data.Events);
        dispatch(loadEvents(events));
        return events
    }
}

export const getEventDetails = (id) => async (dispatch) => {
    const response = await fetch(`/api/events/${id}`);
    if (response.ok) {
        const data = await response.json();
        console.log("data", data);
        data.EventImages = normalize(data.EventImages);
        console.log(data.EventImages)
        dispatch(loadEventDetails(data));
        return data;
    }
}

export const getGroupEvents = (groupId) => async (dispatch) => {
    const response = await fetch(`/api/groups/${groupId}/events`);
    if (response.ok) {
        const data = await response.json();
        const events = normalize(data.Events);
        dispatch(loadGroupEvents(events));
        return events
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
        console.log("THis is the data", data);
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
    } else {
        const errors = await response.json();
        console.log("Hi errors", errors);
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

export const updateEventAction = (event) => async (dispatch) => {
    console.log("Being dispatched", event)
    const response = await csrfFetch(`/api/events/${event.id}/edit`, {
        method: "PUT",
        headers: {'Content-Type': 'Application/json'},
        body: JSON.stringify(event)
    });

    console.log(response);

    if (response.ok) {
      const data = await response.json();
      console.log("the updated event", data);
        dispatch(updateEvent(event));
        return data;
    }

}

export const updateEventImageAction = (image) => async (dispatch) => {
    console.log("The image111111111111", image);
    const response = await csrfFetch(`/api/event-images/${image.id}`, {
        method: "PUT",
        headers: {'Content-Type': 'Application/json'},
        body: JSON.stringify(image)
    });

    console.log(response);

    if (response.ok) {
      const data = await response.json();
      console.log("New image", data);
    //   const image = Object.values(data.EventImages)[0]
      console.log("IMAGEEE", image);
      dispatch(updateEventImage(image));
      return data;
    }
}



// const initialState = { allEvents: {}, singleEvent: {} };
const initialState = {
    allEvents: {

    },

    groupEvents: {

    },

    singleEvent: {

      Group: {

      },

      Venue: {

      },
      EventImages: {},
      Members: [],
      Attendees: [],
    },
  }

const eventsReducer = (state = initialState, action) => {
    let newState = {};
    switch (action.type) {
        case GET_ALL_EVENTS: {
            newState = {
                ...state,
                allEvents: {...action.events}
            }
            return newState;
        }
        case GET_EVENT_DETAILS: {
            newState = {...state};
            newState.singleEvent = {...action.event};
            return newState;
        }
        case GET_GROUP_EVENTS: {
            newState = {
                ...state,
                groupEvents: {...action.events}
            }

            return newState;
        }
        case CREATE_EVENT: {
            const newState = {
                ...state,
                allEvents : {...state.allEvents, [action.event.id]: action.event}
            };

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

        case UPDATE_EVENT: {
            const newState = {...state};
            newState.singleEvent = {...state.singleEvent}
            newState.singleEvent.name = action.event.name;
            newState.singleEvent.type = action.event.type;
            newState.singleEvent.capacity = action.event.capacity;
            newState.singleEvent.price = action.event.price;
            newState.singleEvent.description = action.event.description;
            newState.singleEvent.startDate = action.event.startDate;
            newState.singleEvent.endDate = action.event.endDate;
            return newState;
        }

        case UPDATE_EVENT_IMAGE: {
            const newState = {...state};
            newState.singleEvent.EventImages = {...state.singleEvent.EventImages};
            newState.singleEvent.EventImages[action.image.id] = action.image;
            return newState;

        }
        default: {
            return state;
        }
    }
}

export default eventsReducer
