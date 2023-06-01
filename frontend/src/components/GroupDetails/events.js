import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./GroupDetails.css";
export default function GroupEvents ({flag}) {
    const history = useHistory();
    const events = useSelector((state) => Object.values(state.events.groupEvents));

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

        const handleDate = (date) => {
        const utcDate = new Date(date);
        const options = {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour12: true
        };
        const localTimeString = utcDate.toLocaleDateString(undefined, options);
        return (
            <h4>{localTimeString}</h4>
        )
    }

    const newEvents = upComingEvents(events);
    newEvents.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));
    const pastEvents = events.filter(event => !newEvents.includes(event));
    pastEvents.sort((a, b) => Date.parse(b.startDate) - Date.parse(a.startDate));
    //For switchig between displaying past and new events
    let switchEvents;
    if (flag) switchEvents = newEvents;
    if (!flag) switchEvents = pastEvents;
    // if (!events.length) {
    //     return (
    //         <div>
    //             No events
    //         </div>
    //     )
    // }
    return (
        <>
 {switchEvents.map((event) => (
            <div className="up-coming-events-container" onClick={() => goToDetails(event)} key={event.id}>
                <div className="description-image-event-container">
                <div className="image-container-event-group">
                <img src={event.previewImage}></img>
                </div>
                <div>
                {/* <h4>{ new Date(event.startDate).toDateString()} • {event.startDate.slice(11,19)}</h4> */}
                {handleDate(event.startDate)}

                <h2>{event.name}</h2>


                {event.Venue ? (<><h3>{event.Venue.city}, {event.Venue.state}</h3></> ) : <h3>No Venue for this event yet...</h3>}
                </div>
                </div>
                <div className="event-description-group">{event.description}</div>
            </div>
        ))}
        </>
    )
}
