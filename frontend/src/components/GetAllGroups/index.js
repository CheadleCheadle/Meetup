import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllGroups } from "../../store/groups";

const GroupList = () => {
    const dispatch = useDispatch();
    const groupList = useSelector((state) => Object.values(state.groups));
    console.log(`HELL FROM GROUPLIST`,groupList);

    useEffect(() => {
        dispatch(getAllGroups());
    }, [dispatch]);

    return (
        <>
        <h1>Groups</h1>
        {groupList?.map((group) => (
            <p key={group.id}>{group.name}</p>
        ))}
        </>
    )
}

export default GroupList;
