import {useParams} from "react-router-dom"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEventDetails } from "../../store/events";
import { NavLink } from "react-router-dom";
import picture from "../../images/download.jpg";
export default function EventDetails() {
    const params = useParams();
    let {eventId } = params;
    eventId = parseInt(eventId);
    const dispatch = useDispatch();
    const event = useSelector((state) => state.events.singleEvent);

    console.log("CURRENT EVENT:", event);

    useEffect(() => {
        dispatch(getEventDetails(eventId));
    }, [dispatch]);

    if (!event) {
        console.log("NO EVENT")
        return null;
    }
return (
    <>
    <section>
        <NavLink to="/events">Events</NavLink>
        <div className="container">
        <img src={picture}></img>
        <div className="details">
            <img src={picture}></img>
            <h1>{event.Group.name}</h1>
            <p>Public: {event.Group.private}</p>
        </div>
        <div>
            <h2>START {event.startDate}</h2>
            <h2>END {event.endDate}</h2>
            <h2>{event.price}</h2>
            <h2>{event.type}</h2>
        </div>
        </div>
        <h1>Details</h1>
        <p>{event.description}</p>
    </section>
    </>
)
}
