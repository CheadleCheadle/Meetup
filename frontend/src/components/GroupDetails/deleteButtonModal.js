import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteGroupAction } from "../../store/groups";
import { useHistory } from "react-router-dom";
import "./deleteButton.css";
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
        <div className="delete-group">
        <span className="header-text">
        <h1>Confirm Delete</h1>
        </span>
        <h3> Are you sure you want to remove this group?</h3>
        <div className="button-holder">
        <button id="delete-group-yes" onClick={() => handleDelete(groupId)}>Yes (Delete Group)</button>
        <button id="delete-group-no" onClick={closeModal}>No (Keep Group)</button>
        </div>
        </div>
    )
}
