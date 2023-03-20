import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllGroups } from "../../store/groups";
import { useHistory} from "react-router-dom"
import { NavLink } from "react-router-dom";
import picture from "../../images/download.jpg";
import './GetAllGroups.css';
const GroupList = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const groupList = useSelector((state) => Object.values(state.groups.allGroups));
    const goToDetails = (group) => {
        return history.replace(`/groups/${group.id}`)
    }
    useEffect(() => {
        dispatch(getAllGroups());
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
            <p>Groups in Meetup</p>
        </div>
        </div>
        <section className="displayGroups">
        {groupList?.map((group) => (

            <div key={group.id} className="groups-container"
                 onClick={() => goToDetails(group)}>
            <div className="group-image-container">
            <img src={group.previewImage}></img>
            </div>
            <div className="groupInfo">
                <h2>{group.name}</h2>
                <h3>{group.city}, {group.state}</h3>
                <p>{group.about.slice(0, 255)} ... </p>
                <div className="num-events">
                <h3>{group.Events.length} {group.Events.length > 1 ? "events": "event"}</h3>
                <h3>•</h3>
                <h3>{group.private ? "Private" : "Public"}</h3>
                </div>
            </div>
            </div>
        ))}
        </section>
        </div>
        </>
    )
}

export default GroupList;
