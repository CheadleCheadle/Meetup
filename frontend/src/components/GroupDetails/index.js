import {useParams} from "react-router-dom"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupDetails } from "../../store/groups";
import { NavLink } from "react-router-dom";
import { getGroupEvents } from "../../store/events";
import picture from "../../images/download.jpg";
import { set } from "lodash";
export default function GroupDetails() {
    const params = useParams();
    let { groupId } = params;
    groupId = parseInt(groupId);

    const dispatch = useDispatch();
    const group = useSelector((state) => state.groups.singleGroup);

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
    pastEvents.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));
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
        <h1>Upcoming Events {`(${newEvents.length})`}</h1>
        {newEvents.map((event) => (
            <>
            <div>
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
    <section>
        {pastEvents.length && (
        <h1>Past Events {`(${pastEvents.length})`}</h1>
        )}
        {pastEvents.map((event) => (
            <>
            <div>
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
