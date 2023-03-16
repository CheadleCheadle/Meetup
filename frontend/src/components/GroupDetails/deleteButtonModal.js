import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteGroupAction } from "../../store/groups";
import { useHistory } from "react-router-dom";
export default function DeleteButtonModal({groupId}) {
    const history = useHistory();
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const handleDelete = (groupId) => {
        dispatch(deleteGroupAction(groupId));
        history.push(`/groups/`);
        closeModal();
    }

    return (
        <div>
        <h3>Confirm Delete</h3>
        <p> Are you sure you want to remove this group?</p>
        <button onClick={() => handleDelete(groupId)}></button>
        <button onClick={closeModal}></button>
        </div>
    )
}
