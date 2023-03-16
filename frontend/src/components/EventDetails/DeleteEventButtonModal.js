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
        <div>
            <h3>Confirm Delete</h3>
            <p> Are you sure want to remove this event?</p>
            <button onClick={() => handleDelete(eventId, groupId)}>Yes</button>
            <button onClick={closeModal}>No</button>
        </div>
    )
}
