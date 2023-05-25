import {useParams} from "react-router-dom"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupDetails,deleteGroupAction, getGroupMembers, joinGroupThunk, updateMembershipThunk, deleteMembershipThunk } from "../../store/groups";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faClock, faDollarSign, faLocationDot, faUserGroup} from "@fortawesome/free-solid-svg-icons";
export default function GroupDetails({sessionUser}) {
    const history = useHistory();
    const params = useParams();
    let { groupId } = params;
    groupId = parseInt(groupId);
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [active, setActive] = useState("about");
    const group = useSelector((state) => state.groups.singleGroup);
    const goToDetails = (event) => {
    return history.replace(`/events/${event.id}`);
    }
    const events = useSelector((state) => Object.values(state.events.groupEvents));
    const upComingEvents = (events) => {
        return events.filter(event => {
            if (Date.parse(event.startDate) >= Date.now()) {
                return true;
            }
        })
    }

    const members = group.members;
    console.log("Members", members, typeof sessionUser.id, sessionUser.id);
    const handleJoin = () => {
        dispatch(joinGroupThunk(groupId, sessionUser));
    }
    const HandleDisplayJoin = () => {
        if (members && members[sessionUser.id]) {
            return (
                <div id="join-group-request">
                    Requested
                </div>
            )
    } else if (members) {
        return (
        <div id="join-group" onClick={() => handleJoin(groupId)}>
            Join Group
        </div>
        )
    }

    }


    const newEvents = upComingEvents(events);
    newEvents.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));
    const pastEvents = events.filter(event => !newEvents.includes(event));
    pastEvents.sort((a, b) => Date.parse(b.startDate) - Date.parse(a.startDate));


    useEffect(() => {
        dispatch(getGroupDetails(groupId));
        dispatch(getGroupEvents(groupId))
        .then(() => {
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
                        Edit Group
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
                    <HandleDisplayJoin />
                </div>
            )
        }
    }

    const handleClick = (str) => {
        if (str === "about") {
            setActive("about");
        }
        if (str === "events") {
            setActive("events");
        }
        if (str === "members") {
            setActive("members");
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
            <div id="group-info-cont">
                <h1>{group.name}</h1>
            <div className="details-container">
                <div className = "details">
                <span id="group-info">
                    <FontAwesomeIcon className="fa-lg" icon={faLocationDot} style={{color: "#80858e",}} />
                <h3>{group.city},  {group.state}</h3>
                </span>
                <span id="group-info">
                    <FontAwesomeIcon icon={faUserGroup} style={{color: "#80858e", }}/>
                { group.Events ? <h3> {group.numMembers === 1 ? `${group.numMembers} member`: `${group.numMembers} members`} • {group.private ? "Private" : "Public"}</h3> : `No Events... • ${group.private ? "Private" : "Public"}` }
                </span>
                <span id="group-info">
                    <FontAwesomeIcon icon={faUser} style={{color: "#80858e"}}/>
                <h3>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</h3>
                </span>
                </div>
                {createEventUpdateDelete(groupId)}
            </div>
            </div>

    </section>
    </div>
    <nav id="group-nav">
        <div id="nav-cont">
            <span onClick={() => handleClick("about")} className={active === "about" ? "active-nav": "in-active"}>
                About
            </span>
            <span onClick={() => handleClick("events")} className={active === "events" ? "active-nav": "in-active"}>
                Events
            </span>
            <span onClick={() => handleClick("members")} className={active === "members" ? "active-nav": "in-active"}>
                Members
            </span>
        </div>
    </nav>
    <div className="about-events-wrapper">
        <div className="second-half">
        { active == "about" && <section>

        <div>
            <h1>Organizer</h1>
            <h3>{group.Organizer.firstName} {group.Organizer.lastName}</h3>
        </div>
        <div>
            <h1>What we're about</h1>
            <p>{group.about}</p>
        </div>
        {newEvents.length && active === "events" ? (<>
        <h1>Upcoming Events {`(${newEvents.length})`}</h1>
            <GroupEvents flag={true}></GroupEvents>
        </>): null}
    </section>}
    <section>
        {pastEvents.length && active==="events" ? (<>
        <h1>Past Events {`(${pastEvents.length})`}</h1>
            <GroupEvents flag={false}></GroupEvents>
        </>) : active==="events" ? <div id="no-events-cont">
            <span id="no-events">No past or upcoming events...</span>
            </div> : null}

        {active === "members" && <GroupMembers groupId={groupId} userId={sessionUser.id} organizerId={group.organizerId} members={Object.values(members)} />}
    </section>
    </div>
    </div>
    </div>
    </>


)
}


function GroupMembers ({members, userId, organizerId, groupId}) {
    console.log("Memes", members, userId, organizerId);
    const dispatch = useDispatch();
    const handleAccept = (memberId) => {
        dispatch(updateMembershipThunk(memberId,userId, groupId, "member"))
    }

    const handleDecline = (memberId) => {
        dispatch(deleteMembershipThunk(groupId, memberId));
    }

    const HandlePending = () => {
        return members.map((member) => {

            if (member.Membership.status === "pending" && userId === organizerId) {
                console.log("first  ")
                return (
                    <div key={member.id} id="member-box">
                    <span>
                        <FontAwesomeIcon  className="fa-2x"icon={faUser} />
                    </span>

                    <div id="member-cont">
                    <h4>{member.firstName} {member.lastName}</h4>
                    <h4>{member.Membership.status}</h4>
                    </div>
                    <button onClick={() => handleAccept(member.id)}>Accept</button>
                    <button onClick={() => handleDecline(member.id)}>Reject</button>

                </div>
            )
        } else if (member.Membership.status === "pending" && userId !== organizerId){
            console.log("hiu mom")
            return null
        } else {
                console.log("first  ", member )
            return (
                <div key={member.id} id="member-box">
                    <span>
                        <FontAwesomeIcon  className="fa-2x"icon={faUser} />
                    </span>

                    <div id="member-cont">
                    <h4>{member.firstName} {member.lastName}</h4>
                    <h4>{member.Membership.status}</h4>
                    </div>
                    {organizerId !== member.id &&
                    <button onClick={() => handleDecline(member.id)}>Delete</button>
                    }

                </div>
            )
        }
    })
    }

    return (
        <div id="member-container">
            <h2>All Members</h2>
            <HandlePending />

        </div>
    )
}
