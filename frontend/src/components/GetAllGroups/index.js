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
        // return <Redirect to={`/groups/1`}/>;
    }
    useEffect(() => {
        dispatch(getAllGroups());
    }, [dispatch]);

    return (
        <>
        <nav>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/groups">Groups</NavLink>
            <p>Groups in Meetup</p>
        </nav>
        <section className="displayGroups">
        {groupList?.map((group) => (
            <>
            <div className="groups-container"
                 onClick={() => goToDetails(group)}>
            <img src={picture}></img>
            <div className="groupInfo">
                <h2>{group.name}</h2>
                <h3>{group.city}, {group.state}</h3>
                <p>{group.about}</p>
                <h3>{group.type}</h3>
                {/* Will need to add number of events later. Will make a function that gets all events by groupId, import that function here and pass in group to it */}
            </div>
            </div>
            </>
        ))}
        </section>
        </>
    )
}

export default GroupList;
