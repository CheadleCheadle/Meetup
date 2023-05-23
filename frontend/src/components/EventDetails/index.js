import { useState } from "react";
import {useParams} from "react-router-dom"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEventDetails, deleteEventAction } from "../../store/events";
import { getGroupDetails } from "../../store/groups";
import { NavLink, useHistory} from "react-router-dom";
import picture from "../../images/download.jpg";
import OpenModalButton from "../OpenModalButton";
import DeleteEventButtonModal from "./DeleteEventButtonModal";
import "./EventDetails.css";
import Loading from "../loading";
export default function EventDetails({sessionUser}) {
    const history = useHistory();
    const params = useParams();
    let {eventId } = params;
    eventId = parseInt(eventId);
    const dispatch = useDispatch();
    const event = useSelector((state) => state.events.singleEvent);
    const eventsGroup = useSelector((state) => state.groups.singleGroup);
    const groupId = event.groupId;
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(getEventDetails(eventId));
    }, [dispatch]);

    useEffect(() => {
        if (event.id) {
            console.log("uSeffect is running", event)
            dispatch(getGroupDetails(event.groupId))
            .then(() => {
                setIsLoaded(true);
            })
        }
    }, [event]);

    if (!Object.keys(event).length) {
        return null;
    }

    if (!event.id) {
        return null;
    }


    const ImageFallBack = ( { src, fallbackSrc, alt }) => {
        console.log("fal", fallbackSrc)
        const handleImageError = (event) => {
            event.target.src = fallbackSrc
        }
        return <img src={src} onError={handleImageError} alt={alt} />;
    }



     const renderDeleteButton = () => {
        if (sessionUser?.id === eventsGroup.organizerId) {
            return <div className="group-buttons"><OpenModalButton
            buttonText="Delete"
            modalComponent={<DeleteEventButtonModal groupId={groupId} eventId={eventId}></DeleteEventButtonModal>}></OpenModalButton>
            <button onClick={() =>  history.push(`/events/{eventId}/edit`)}>Update</button>
            </div>
        } else {
            return null;

        }
    }

if (!isLoaded) {
    return (
        <Loading />
    )
}
return ( isLoaded &&
    <>
    <section className="events-wrapper">
        <div className="events-navigation">
        <NavLink to="/events">Events</NavLink>
        <h1>{event.name}</h1>
        <h3>Hosted by {eventsGroup.Organizer.firstName} {eventsGroup.Organizer.lastName}</h3>
        </div>
        <div className="event-container">
            <div className="first-event-section">
        <div className="event-image-container">
            <ImageFallBack
            src={event.EventImages[0]?.url}
            fallbackSrc="https://logos-world.net/wp-content/uploads/2021/02/Meetup-Logo.png"
            alt="Image of Meetup logo"
            />
        {/* <img src={event.EventImages[0]?.url} onError={this.src="https://logos-world.net/wp-content/uploads/2021/02/Meetup-Logo.png"}></img> */}
        </div>
        <div className="group-event-details">
        <div className="group-details">
            <div className="group-image-container-event">
            <img src={eventsGroup.GroupImages[0].url}></img>
            </div>
            <div className="group-event-detail-public">
            <h1>{event.Group.name}</h1>
            <p>{event.Group.private ? "Private" : "Public"}</p>
            </div>
        </div>
        <div className="event-details-container">
            <div className="event-details">

                <div className="section-one-event">
                    <div className="clock">🕒</div>
                    <div className="time">
                        <div>Start</div>
                        <div>End</div>
                    </div>
                    <div className="start-end">
                        <div>{new Date(event.startDate).toDateString()} • {event.startDate.slice(11, 19)}</div>
                        <div>{new Date(event.endDate).toDateString()} • {event.endDate.slice(11,19)}</div>
                    </div>
                </div>

                <div className="section-two-event">
                    <div className="dollar">💲</div>
                    <div className="price">${event.price > 0 ? event.price : " Free"}</div>
                </div>

                <div className="section-three-event">
                    <div className="type-wrap">
                    <div className="pin">📍</div>
                    <div className="type">{event.type}</div>
                    </div>
                    <div className="button-cont">
                    {renderDeleteButton()}
                    </div>
                </div>
            </div>
        </div>
        </div>
        </div>
        <div className="about-wrapper-event">
        <h1>Details</h1>
        <p>{event.description}</p>
        </div>
        </div>
    </section>
    </>
)

}
