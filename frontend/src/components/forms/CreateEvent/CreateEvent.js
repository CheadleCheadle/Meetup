import React, {useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createEventAction, createEventImageAction} from "../../../store/events";
import { useSelector } from "react-redux";
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
        console.log("ID", newEvent.id);
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
        if (!image.endsWith(".jpeg") || !image.endsWith(".jpg") || !image.endsWith(".png")) {
            tempErrors.image = "Image URL must end in .png, .jpg, or .jpeg";
        }
        if (about.length < 30) {
            tempErrors.about = "Description needs 30 or more characters";
        }
        setErrors(tempErrors);
    }

    useEffect(() => {
        validation();
        console.log("price", typeof price, price);
    }, [name, type, isPrivate, price, startDate, endDate, image, about])
    return (
        <>
          <h1>Create an event for {group.name}</h1>
          <form onSubmit={handleSubmit}>
            <label>
                <p>What is the name of your event?</p>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
                <p className="errors">{errors.name}</p>
            </label>
            <label>
                <p>Is this an in person or online event?</p>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="In person">In person</option>
                    <option value="Online">Online</option>
                </select>
                <p className="errors">{errors.type}</p>
            </label>
            <p>Is this event private or public?</p>
            <label>
            <select value={isPrivate} onChange={(e) => setisPrivate(e.target.value)}>
                <option value="Private">Private</option>
                <option value="Public">Public</option>
            </select>
             <p className="errors">{errors.private}</p>
            </label>
            <label>
                <p>What is the price for your event?</p>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}></input>
                <p className="errors">{errors.price}</p>
            </label>
            <label>
                <p>When does your event start?</p>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}></input>
                <p  className="errors">{errors.startDate}</p>
            </label>
            <p>When does your event end?</p>
            <label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}></input>
                <p className="errors">{errors.endDate}</p>
            </label>
            <label>
                <p>Please add in image url for your event below:</p>
                <input type="text" value={image} onChange={(e) => setImage(e.target.value)}></input>
                <p className="errors">{errors.image}</p>
            </label>
            <p>Please describe your event:</p>
            <label>
                <textarea type="text" value={about} onChange={(e) => setAbout(e.target.value)}></textarea>
                <p className="errors">{errors.about}</p>
            </label>
            <input disabled={Object.values(errors).length} type="submit" value="Create Event"></input>
          </form>
        </>
    )

}
