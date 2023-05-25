import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteEventAction } from "../../store/events";
import { useHistory } from "react-router-dom";

export default function DeleteEventButtonModal({eventId, groupId}) {
    const history = useHistory();
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = (eventId) => {
        dispatch(deleteEventAction(eventId));
        history.push(`/groups/${groupId}`)
        closeModal();
    }

    return (
        <div className="delete-group">
        <span className="header-text">
        <h1>Confirm Delete</h1>
        </span>
        <h3> Are you sure you want to remove this event?</h3>
        <div className="button-holder">
        <button id="delete-group-yes" onClick={() => handleDelete(eventId)}>Delete</button>
        <button id="delete-group-no" onClick={closeModal}>Cancel</button>
        </div>
        </div>
    )
}
