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

    const upComingEvents = (events) => {
        return events.filter(event => {
            if (Date.parse(event.startDate) >= Date.now()) {
                return true;
            }
        })
    }
    // const orderEventList = eventList.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));
    const newEvents = upComingEvents(eventList);
    newEvents.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));
    const pastEvents = eventList.filter(event => !newEvents.includes(event));
    pastEvents.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));
    const orderedEvents = [...newEvents, ...pastEvents];
    const setGroup = (event) => {
        dispatch(getGroupDetails(event.groupId))
    }

    const handleDate = (date) => {
        const utcDate = new Date(date);
        const options = {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        const localTimeString = utcDate.toLocaleDateString(undefined, options);
        return (
            <p>{localTimeString}</p>
        )
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
        {orderedEvents?.map((event) => (

            <div key={event.id} className="events">
            <div className="events-container"
                 onClick={() => {
                    setGroup(event);
                    goToDetails(event)
                    }}>
                <div className="events-image-container">
                <img src={event.previewImage}></img>
                </div>
                <div className="eventInfo">
                    {/* <p>{event.startDate.slice(0,10)} • {event.startDate.slice(11, 19)}</p> */}
                    {handleDate(event.startDate)}
                    <h1>{event.name}</h1>
                    {event.Venue ? ( <h3>{event.Venue.city}, {event.Venue.state}</h3>) : (<p>No Venue for this event yet...</p>)}
                </div>
            </div>
            <div onClick={() => {
                setGroup(event);
                goToDetails(event);
            }} className="event-desc">{event.description}</div>
            </div>
        ))}
        </section>
</div>
        </>
    )

}
