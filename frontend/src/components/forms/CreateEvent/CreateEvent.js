import React, {useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createEventAction, createEventImageAction} from "../../../store/events";
import { useSelector } from "react-redux";
import "./CreateEvent.css"
export default function CreateEvent() {
    const group = useSelector((state) => state.groups.singleGroup);
    console.log("group", group);
    const history = useHistory();
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [isPrivate, setisPrivate] = useState("");
    const [price, setPrice] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [image, setImage] = useState("");
    const [about, setAbout] = useState("");
    const [errors, setErrors] = useState({});
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
        const theImage = {url:image, preview: true}
        const newEvent = await dispatch(createEventAction(event, group.id));
        console.log("ID", event);
        await dispatch(createEventImageAction(newEvent.id,theImage));
        history.push(`/events/${newEvent.id}`);
    }

    const validation = () => {
        const tempErrors = {};
        if (name === "") {
            tempErrors.name = "Name is required";
        }
        if (type === "") {
            tempErrors.type = "Event Type is required";
        }
        if (isPrivate === "") {
            tempErrors.private = "Visibility is required";
        }
        if (price === "") {
            tempErrors.price = "Price is required";
        }
        if (startDate === "") {
            tempErrors.startDate = "Event start is required";
        }
        if (endDate === "") {
            tempErrors.endDate = "Event end is required";
        }
        if (!["jpg", "jpeg", "png"].includes(image.slice(image.length - 5).split(".")[1])) {
            tempErrors.image = "Image URL must end in .png, .jpg, or .jpeg";
        }
        if (about.length < 30) {
            tempErrors.about = "Description must be at least 30 characters long";
        }
        setErrors(tempErrors);
    }

    useEffect(() => {
        validation();
    }, [name, type, isPrivate, price, startDate, endDate, image, about])
    return (
        <>
        <div className="create-event-wrap">
          <h1 id="title">Create an event for {group.name}</h1>
          <form id="create-event-form" onSubmit={handleSubmit}>
            <label>
                <h3 id="first-h3">What is the name of your event?</h3>
                <input placeholder="Event Name"className="event-name" type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
                <p className="errors">{errors.name}</p>
            </label>
            <label>
                <h3>Is this an in person or online event?</h3>
                <select required className="drop-downs"value={type} onChange={(e) => setType(e.target.value)}>
                    <option className="default-drop" value="" disabled selected hidden>(select one)</option>
                    <option value="In person">In person</option>
                    <option value="Online">Online</option>
                </select>
                <p className="errors">{errors.type}</p>
            </label>
            <h3>Is this event private or public?</h3>
            <label>
            <select className="drop-downs" value={isPrivate} onChange={(e) => setisPrivate(e.target.value)}>
                <option value="" disabled selected hidden>(select one)</option>
                <option value="Private">Private</option>
                <option value="Public">Public</option>
            </select>
             <p className="errors">{errors.private}</p>
            </label>
            <label>
                <h3 id="price-h3">What is the price for your event?</h3>
                <input placeholder="$" id="price" type="text" value={price} onChange={(e) => setPrice(e.target.value)}></input>
                <p className="errors">{errors.price}</p>
            </label>
            <label>
                <h3>When does your event start?</h3>
            <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)}></input>
                <p  className="errors">{errors.startDate}</p>
            </label>
            <h3>When does your event end?</h3>
            <label>
                <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)}></input>
                <p className="errors">{errors.endDate}</p>
            </label>
            <label>
                <h3>Please add in image url for your event below:</h3>
                <input className="event-name"type="text" value={image} onChange={(e) => setImage(e.target.value)}></input>
                <p className="errors">{errors.image}</p>
            </label>
            <h3 id="description-head">Please describe your event:</h3>
            <label>
                <textarea placeholder="Please include at least 30 characters" id="event-description" type="text" value={about} onChange={(e) => setAbout(e.target.value)}></textarea>
                <p className="errors">{errors.about}</p>
            </label>
            <div id="button-container-update">
            <input id="submit-button" disabled={Object.values(errors).length} type="submit" value="Create Event"></input>
            </div>
          </form>
          </div>
        </>
    )

}
