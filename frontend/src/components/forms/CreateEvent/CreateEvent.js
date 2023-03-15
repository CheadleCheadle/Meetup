import React, {useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createEventAction } from "../../../store/events";
import { useSelector } from "react-redux";
export default function CreateEvent() {
    const group = useSelector((state) => state.groups.singleGroup);
    console.log("group", group);
    const history = useHistory();
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [isPrivate, setisPrivate] = useState("");
    const [price, setPrice] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [image, setImage] = useState("");
    const [about, setAbout] = useState("");

     const stringToBool = (bool) => {
        if (bool === "Private") {
            return true
        } else {
            return false
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const event = {name, type, private: stringToBool(isPrivate), price:Number(price), description:about, startDate, endDate};
        console.log('NEW EVENT',event);
        console.log("id", group)
        const newEvent = await dispatch(createEventAction(event, group.id));
        console.log("awaited Event", newEvent);
        history.replace(`/events/${newEvent.id}`);
    }
    return (
        <>
          <h1>Create an event for {group.name}</h1>
          <form onSubmit={handleSubmit}>
            <label>
                <p>What is the name of your event?</p>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
                <p></p>
            </label>
            <label>
                <p>Is this an in person or online event?</p>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="In person">In person</option>
                    <option value="Online">Online</option>
                </select>
                <p></p>
            </label>
            <p>Is this event private or public?</p>
            <label>
            <select value={isPrivate} onChange={(e) => setisPrivate(e.target.value)}>
                <option value="Private">Private</option>
                <option value="Public">Public</option>
            </select>
            </label>
            <label>
                <p>What is the price for your event?</p>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}></input>
                <p></p>
            </label>
            <label>
                <p>When does your event start?</p>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}></input>
                <p></p>
            </label>
            <p>When does your event end?</p>
            <label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}></input>
                <p></p>
            </label>
            <label>
                <p>Please add in image url for your event below:</p>
                <input type="text" value={image} onChange={(e) => setImage(e.target.value)}></input>
            </label>
            <p>Please describe your event:</p>
            <label>
                <textarea type="text" value={about} onChange={(e) => setAbout(e.target.value)}></textarea>
                <p></p>
            </label>
            <input type="submit" value="Create Event"></input>
          </form>
        </>
    )

}
