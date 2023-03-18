import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import picture from "../../images/download.jpg";
export default function GroupEvents ({flag}) {
    const history = useHistory();
    const events = useSelector((state) => Object.values(state.events.allEvents));

    const upComingEvents = (events) => {
        return events.filter(event => {
            if (Date.parse(event.startDate) >= Date.now()) {
                return true;
            }
        })
    }

    const goToDetails = (event) => {
    return history.replace(`/events/${event.id}`);
    }

    const newEvents = upComingEvents(events);
    newEvents.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));
    const pastEvents = events.filter(event => !newEvents.includes(event));
    pastEvents.sort((a, b) => Date.parse(b.startDate) - Date.parse(a.startDate));
    //For switchig between displaying past and new events
    let switchEvents;
    if (flag) switchEvents = newEvents;
    if (!flag) switchEvents = pastEvents;

    return (
        <>
 {switchEvents.map((event) => (
            <div className="up-coming-events-container" onClick={() => goToDetails(event)} key={event.id}>
                <div className="description-image-event-container">
                <div className="image-container-event-group">
                <img src={picture}></img>
                </div>
                <div>

                <h4>{event.startDate.slice(0,13)}</h4>

                <h2>{event.name}</h2>


                {event.Venue ? (<><h3>{event.Venue.city} {event.Venue.state}</h3></> ) : <h3>No Venue for this event yet...</h3>}
                </div>
                </div>
                <div className="event-description-group">{event.description}</div>
            </div>
        ))}
        </>
    )
}