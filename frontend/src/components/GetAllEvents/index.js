import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../../store/events";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import picture from "../../images/download.jpg";
import { getGroupDetails } from "../../store/groups";
import "./GetAllEvents.css"
export default function EventList() {
    const history = useHistory();
    const dispatch = useDispatch();
    const eventList = useSelector((state) => Object.values(state.events.allEvents));
    console.log('EVENTS',eventList);
    const setGroup = (event) => {
        dispatch(getGroupDetails(event.groupId))
    }

    const goToDetails = (event) => {
       return history.push(`/events/${event.id}`);
    }
    useEffect(() => {
        dispatch(getAllEvents())
    }, [dispatch]);
    return (
        <>
        <div className="main-wrapper">
        <div className="nav-container">
        <nav className="event-group-heading">
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/groups">Groups</NavLink>
        </nav>
        <div className="sub-header">
            <p>Events in meetup</p>
        </div>
        </div>

        <section className="displayEvents">
        {eventList?.map((event) => (
            <>
            <div className="events-container"
                 onClick={() => {
                    setGroup(event);
                    goToDetails(event)
                    }}>
                <img src={picture}></img>
                <div className="eventInfo">
                    <p>{event.startDate}</p>
                    <h1>{event.name}</h1>
                    {event.Venue ? ( <p>{event.Venue.city} {event.Venue.state}</p>) : (<p>No Venue for this event yet...</p>)}
                </div>
            </div>
            <div className="event-desc">{event.description}</div>
            </>
        ))}
        </section>
</div>
        </>
    )

}
