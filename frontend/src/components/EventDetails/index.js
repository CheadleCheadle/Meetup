import {useParams} from "react-router-dom"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEventDetails, deleteEventAction } from "../../store/events";
import { getGroupDetails } from "../../store/groups";
import { NavLink, useHistory} from "react-router-dom";
import picture from "../../images/download.jpg";
import OpenModalButton from "../OpenModalButton";
import DeleteEventButtonModal from "./DeleteEventButtonModal";
export default function EventDetails({sessionUser}) {
    const history = useHistory();
    const params = useParams();
    let {eventId } = params;
    eventId = parseInt(eventId);
    const dispatch = useDispatch();
    const event = useSelector((state) => state.events.singleEvent);
    const eventsGroup = useSelector((state) => state.groups.singleGroup);
    console.log('CURRENT GROUP',eventsGroup);
    const groupId = event.groupId;


    useEffect(() => {
        dispatch(getEventDetails(eventId));
    }, [dispatch]);
    if (!Object.keys(event).length) {
        return null;
    }

    if (!event.id) {
        return null;
    }



     const renderDeleteButton = () => {
        if (sessionUser?.id === eventsGroup.organizerId) {
            return <OpenModalButton
            itemText="Delete"
            modalComponent={<DeleteEventButtonModal groupId={groupId} eventId={eventId}></DeleteEventButtonModal>}></OpenModalButton>
        } else {
            return null;

        }
    }
    // const deleteEvent = () => {
    //     dispatch(deleteEventAction(eventId));
    //     history.push(`/groups/${groupId}`);
    // }

return (
    <>
    <section>
        <NavLink to="/events">Events</NavLink>
        <div className="event-container">
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
            {renderDeleteButton()}
        </div>
        </div>
        <h1>Details</h1>
        <p>{event.description}</p>
    </section>
    </>
)

}
