import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../../store/events";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import picture from "../../images/download.jpg";
import { getGroupDetails } from "../../store/groups";
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
        <nav>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/groups">Groups</NavLink>
            <p>Events in Meetup</p>
        </nav>
        <section>

        {eventList.map((event) => (
            <>
            <div className="events-container"
                 onClick={() => {
                    console.log('IM BEING CLICKED');
                    setGroup(event);
                    goToDetails(event)
                    }}>
                <img src={picture}></img>
                <div>
                    <p>{event.startDate}</p>
                    <h1>{event.name}</h1>
                    {event.Venue ? ( <p>{event.Venue.city} {event.Venue.state}</p>) : (<p>No Venue for this event yet...</p>)}

                </div>
            </div>
            </>
        ))}
        </section>
        </>
    )

}
