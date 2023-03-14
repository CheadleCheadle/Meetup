import {useParams} from "react-router-dom"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupDetails } from "../../store/groups";
import { NavLink } from "react-router-dom";
import picture from "../../images/download.jpg";
export default function GroupDetails() {
    const params = useParams();
    let { groupId } = params;
    groupId = parseInt(groupId);


    const dispatch = useDispatch();
    const group = useSelector((state) => state.groups.singleGroup);

    console.log('THIS IS MY GROUP',group);

    useEffect(() => {
        dispatch(getGroupDetails(groupId));
    }, [dispatch]);
    if (!group) {
        return null;
    }
    if (isNaN(groupId)) {
        return null;
    }
return (
    <>
    <section>
        <NavLink to="/groups">Groups</NavLink>
        <div className="group-container">
            <img src={picture}></img>
            <div className="details">
                <h1>{group.name}</h1>
                <h3>{group.city} {group.state}</h3>
                <h3>##events {group.type}</h3>
                <h3>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</h3>
            </div>
        </div>
    </section>
    <section>
        <div>
            <h1>Organizer</h1>
            <h2>{group.Organizer.firstName} {group.Organizer.lastName}</h2>
        </div>
        <div>
            <h1>What we're about</h1>
            <p>{group.about}</p>
        </div>
    </section>
    </>


)
}
