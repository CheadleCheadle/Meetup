import {useParams} from "react-router-dom"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupDetails,deleteGroupAction } from "../../store/groups";
import { NavLink } from "react-router-dom";
import { deleteEventAction, getGroupEvents } from "../../store/events";
import picture from "../../images/download.jpg";
import {useModal} from "../../context/Modal";
import DeleteButtonModal from "./deleteButtonModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import OpenModalButton from "../OpenModalButton";
import { useHistory } from "react-router-dom";
import GroupEvents from "./events";
import "./GroupDetails.css";
import Loading from "../loading";
export default function GroupDetails({sessionUser}) {
    const history = useHistory();
    const params = useParams();
    let { groupId } = params;
    groupId = parseInt(groupId);
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
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
        dispatch(getGroupEvents(groupId))
        .then(() => {
            console.log("Im being upodate");
            setIsLoaded(true);
        })
    }, [dispatch, groupId]);


    if (!group.id) {
        return null;
    }
    if (isNaN(groupId)) {
        return null;
    }
    const createEvent = () => {
        // dispatch
        history.push(`/groups/${groupId}/events/new`)
    }
    const updateGroup = () => {
        history.push(`/groups/${groupId}/edit`)
    }

    const createEventUpdateDelete = (groupId) => {
        if (sessionUser?.id === group.organizerId) {
            return (
                <div className="group-buttons">
                    <button onClick={() => createEvent()}>
                    Create event
                    </button>
                    <button onClick={() => updateGroup()}>
                    Update
                    </button>
                    <OpenModalButton
                     buttonText="Delete"
                     modalComponent={<DeleteButtonModal groupId={groupId}></DeleteButtonModal>}
                    ></OpenModalButton>
                </div>
            )
        } else if (sessionUser){
            return (
                <div className="group-button-delete">
                    <button onClick={() => window.alert("Feature Coming Soon...")}>Join this group</button>
                </div>
            )
        }
    }

    if (!isLoaded) {
        return (
            <Loading />
        )
    }

return ( isLoaded &&
    <>
    <div className="group-details-wrapper">
        <div className="image-details-wrapper">
        <div className="bread-crumb">
        <NavLink to="/groups">Groups</NavLink>
        </div>
    <section className="display-img-details">

            <div className="group-image-cont">
            <img src={group.GroupImages[0].url}></img>
            </div>
            <div className="details-container">
                <div className = "details">
                <h1>{group.name}</h1>
                <h3>{group.city} {group.state}</h3>
                { group.Events ? <h3>{group.Events.length} {group.Events.length > 1 ? "events" : group.Events.length < 1 ? "events" : "event"}  •  {group.private ? "Private" : "Public"}</h3> : `No Events... • ${group.private ? "Private" : "Public"}` }
                <h3>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</h3>
                </div>
                <div className="button-container-group">
                {createEventUpdateDelete(groupId)}
                </div>
            </div>

    </section>
    </div>
    <div className="about-events-wrapper">
        <div className="second-half">
        <section>

        <div>
            <h1>Organizer</h1>
            <h3>{group.Organizer.firstName} {group.Organizer.lastName}</h3>
        </div>
        <div>
            <h1>What we're about</h1>
            <p>{group.about}</p>
        </div>
        {newEvents.length ? (<>
        <h1>Upcoming Events {`(${newEvents.length})`}</h1>
            <GroupEvents flag={true}></GroupEvents>
        </>) : null}
    </section>
    <section>
        {pastEvents.length ? (<>
        <h1>Past Events {`(${pastEvents.length})`}</h1>
            <GroupEvents flag={false}></GroupEvents>
        </>) : null}
    </section>
    </div>
    </div>
    </div>
    </>


)
}
