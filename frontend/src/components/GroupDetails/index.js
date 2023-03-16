import {useParams} from "react-router-dom"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupDetails,deleteGroupAction } from "../../store/groups";
import { NavLink } from "react-router-dom";
import { deleteEventAction, getGroupEvents } from "../../store/events";
import picture from "../../images/download.jpg";
import { useHistory } from "react-router-dom";
export default function GroupDetails({sessionUser}) {
    const history = useHistory();
    const params = useParams();
    let { groupId } = params;
    groupId = parseInt(groupId);
    const dispatch = useDispatch();
    const group = useSelector((state) => state.groups.singleGroup);
    const goToDetails = (event) => {
    return history.replace(`/events/${event.id}`);
    }
    const events = useSelector((state) => Object.values(state.events.allEvents));
    const upComingEvents = (events) => {
        return events.filter(event => {
            if (Date.parse(event.startDate) >= Date.now()) {
                return true;
            }
        })
    }
    const newEvents = upComingEvents(events);
    newEvents.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));
    const pastEvents = events.filter(event => !newEvents.includes(event));
    pastEvents.sort((a, b) => Date.parse(b.startDate) - Date.parse(a.startDate));

    useEffect(() => {
        dispatch(getGroupDetails(groupId));
        dispatch(getGroupEvents(groupId));
    }, [dispatch]);
    if (!group) {
        return null;
    }
    if (isNaN(groupId)) {
        return null;
    }
    const createEvent = () => {
        history.push(`/groups/${groupId}/events/new`)
    }
    const updateGroup = () => {
        history.push(`/groups/${groupId}/edit`)
    }
    const deleteGroup = () => {
        dispatch(deleteGroupAction(groupId));
        // events.forEach(event => {
        // dispatch(deleteEventAction(event.id));
        // })
        history.push(`/groups/`);
    }
    const createEventUpdateDelete = () => {
        if (sessionUser?.id === group.organizerId) {
            return (
                <div>
                    <button onClick={() => createEvent()}>
                    Create event
                    </button>
                    <button onClick={() => updateGroup()}>
                    Update
                    </button>
                    <button onClick={() =>  deleteGroup()}>
                    Delete
                    </button>
                </div>
            )
        } else {
            return (
                <div>
                    <button>Join this group</button>
                </div>
            )
        }
    }
return (
    <>
    <section>
        <NavLink to="/groups">Groups</NavLink>
        <div className="group-container">
            <img src={picture}></img>
            <div className="details">
                <h1>{group.name}</h1>
                <h3>{group.city} {group.state}</h3>
                <h3>##events {group.type}</h3>
                <h3>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</h3>
                {createEventUpdateDelete()}
            </div>
        </div>
    </section>
    <section>
        <div>
            <h1>Organizer</h1>
            <h2>{group.Organizer.firstName} {group.Organizer.lastName}</h2>
        </div>
        <div>
            <h1>What we're about</h1>
            <p>{group.about}</p>
        </div>
        {newEvents.length ? (
        <h1>Upcoming Events {`(${newEvents.length})`}</h1>
        ) : (<h1>No Upcoming Events</h1>)}

        {newEvents.map((event) => (
            <>
            <div onClick={() => goToDetails(event)} key={event.id}>
                <img src={picture}></img>
                {event.name}

                {event.startDate}

                {event.endDate}

                {event.Venue ? (<><p>{event.Venue.city}</p> <p>{event.Venue.state}</p></> ) : <p>No Venue for this event yet...</p>}
            </div>
            </>
        ))}
    </section>
    <section>
        {pastEvents.length ? (
        <h1>Past Events {`(${pastEvents.length})`}</h1>
        ) : null}
        {pastEvents.map((event) => (
            <>
            <div onClick={() => goToDetails(event)} key={event.id}>
                <img src={picture}></img>
                 {event.name}
                {event.startDate}

                {event.endDate}

                {event.Venue.city}

                {event.Venue.state}
            </div>
            </>
        ))}
    </section>
    </>


)
}
