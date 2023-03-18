import {useParams} from "react-router-dom"
import { useEffect } from "react";
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
export default function GroupDetails({sessionUser}) {
    const history = useHistory();
    const params = useParams();
    let { groupId } = params;
    groupId = parseInt(groupId);
    const dispatch = useDispatch();
    const group = useSelector((state) => state.groups.singleGroup);
    console.log("Group", group);
//   const { setModalContent, setOnModalClose } = useModal();
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
        dispatch(getGroupEvents(groupId));
    }, [dispatch]);
    if (!group.id) {
        return null;
    }
    if (isNaN(groupId)) {
        return null;
    }
    const createEvent = () => {
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
        } else {
            return (
                <div className="group-button-delete">
                    <button onClick={() => window.alert("Feature Coming Soon...")}>Join this group</button>
                </div>
            )
        }
    }

return (
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
                <h3>{group.Events.length} {group.Events.length > 1 ? "events" : "event"}  •  {group.type}</h3>
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
