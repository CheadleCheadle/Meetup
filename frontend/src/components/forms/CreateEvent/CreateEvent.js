import React, {useEffect, useState } from "react";
import { useHistory, useParams} from "react-router-dom";
import { useDispatch } from "react-redux";
import { getEventDetails,createEventAction, createEventImageActionDefault, createEventImageAction, updateEventAction, updateEventImageAction, getAllEvents} from "../../../store/events";
import { useSelector } from "react-redux";
import Loading from "../../loading";
import "./CreateEvent.css"
import { getGroupDetails } from "../../../store/groups";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
export default function CreateEvent({update}) {
    const group = useSelector((state) => state.groups.singleGroup);
    const singleEvent = useSelector(state => state.events.singleEvent);
    let {eventId, groupId } = useParams()
    groupId = parseInt(groupId);
    eventId = parseInt(eventId);

    const history = useHistory();
    const dispatch = useDispatch();
    const currentEvent = useSelector((state) => state.events.singleEvent);
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [isPrivate, setisPrivate] = useState("");
    const [price, setPrice] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [image, setImage] = useState("");
    const [about, setAbout] = useState("");
    const [errors, setErrors] = useState({});
    const [disabled, setDisabled] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

     const stringToBool = (bool) => {
        if (bool === "Private") {
            return true
        } else {
            return false
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        if (!disabled) {
        const event = {name, type, private: stringToBool(isPrivate), price:Number(price), description:about, startDate, endDate};
        if (update) {
            event.id = eventId;
        }
        let theImage = {url:"https://logos-world.net/wp-content/uploads/2021/02/Meetup-Logo.png"}
        if (image) {
             theImage = image;
        }

        if (update) {
            const updatedEvent = dispatch(updateEventAction(event))
            .then((d) => {
                const images = d.EventImages;
                const oldImage = images[0];
                theImage.id = oldImage.id;
                theImage.eventId = eventId;
                dispatch(updateEventImageAction(image, eventId));
             history.push(`/events/${eventId}`)
            })


        } else if (!update) {
            try {
                const newEvent = dispatch(createEventAction(event, group.id))
                .then((event) => {
                    if (!image) {
                        dispatch(createEventImageActionDefault(event.id,theImage))
                        .then(() => {
                            history.push(`/events/${event.id}`);
                        });
                    } else {
                        dispatch(createEventImageAction(event.id,theImage))
                        .then(() => {
                            history.push(`/events/${event.id}`);
                        });
                    }
                });
            } catch (e) {
            }
        }
    }
    }
    //Handle validations
    useEffect(() => {

        const tempErrors = {};
        if (name?.replaceAll(' ', '') === "") {
            tempErrors.name = "Name is required";
        }
        if (name?.length > 100) {
            tempErrors.name = "Name must be less than 100 characters"
        }
        if (type?.replaceAll(' ', '') === "") {
            tempErrors.type = "Event Type is required";
        }
        if (isPrivate?.replaceAll(' ', '') === "") {
            tempErrors.private = "Visibility is required";
        }
        if (typeof price === "String" && price?.replaceAll(' ', '') === "") {
            tempErrors.price = "Price is required";
        }
        if (startDate?.replaceAll(' ', '') === "") {
            tempErrors.startDate = "Event start is required";
        }
        if (endDate?.replaceAll(' ', '') === "") {
            tempErrors.endDate = "Event end is required";
        }
        if (about?.length < 30 || about?.replaceAll(' ', '') === "") {
            tempErrors.about = "Description must be at least 30 characters long";
        }
        setErrors(tempErrors);

        if (Object.keys(tempErrors).length === 0) {

            setDisabled(false);
        } else {
            setDisabled(true);

        }
    }, [name, type, isPrivate, price, startDate, endDate, image, about, submitted, update])

    useEffect(() => {
        dispatch(getAllEvents())
        dispatch(getGroupDetails(groupId))
        .then(() => {
            setIsLoaded(true)
        })
        setErrors([update]);
    },[]);

    useEffect(() => {
        dispatch(getEventDetails(eventId))
        if (update) {
             setName(currentEvent.name);
            setAbout(currentEvent.description);
            setType(currentEvent.type);
            if (currentEvent.private) {
                setisPrivate("Private");
            } else {
                setisPrivate("Public");
            }
            setPrice(currentEvent.price);

            const startDate = new Date(currentEvent.startDate);
            startDate.setHours(startDate.getHours());
            startDate.setMinutes(startDate.getMinutes());
            const formattedStartDate = startDate.toISOString().slice(0, 16);

            setStartDate(formattedStartDate);

            const endDate= new Date(currentEvent.endDate);
            endDate.setHours(endDate.getHours());
            endDate.setMinutes(endDate.getMinutes());
            const formattedEndDate = endDate.toISOString().slice(0, 16);
            setEndDate(formattedEndDate);
            if (currentEvent.EventImages.length > 0) {
                setImage(currentEvent.EventImages[0].url)
            }


        }
    },[update, dispatch]);

    const updateFile = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
    };

    if (!isLoaded) {
        return (
            <Loading />
        )
    }


    return ( isLoaded &&
        <>
        <div className="create-event-wrap">
            {!update ? <h1 id="title">Create an event for {group.name}</h1> : <h1 id="title">Update your event's information</h1>}
          <form id="create-event-form" >
            <label>
                <h3 id="first-h3">What is the name of your event?</h3>
                <input  id="event-name"placeholder="Event Name"className="event-name" type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
                {submitted && errors.name ? <p className="errors">{errors.name}</p> : null}
            </label>
            <label>
                <h3>Is this an in person or online event?</h3>
                <select required className="drop-downs"value={type} onChange={(e) => setType(e.target.value)}>
                    <option className="default-drop" value="" disabled selected hidden>(select one)</option>
                    <option value="In person">In person</option>
                    <option value="Online">Online</option>
                </select>
                {submitted && errors.type ? <p className="errors">{errors.type}</p> : null}
            </label>
            <h3>Is this event private or public?</h3>
            <label>
            <select className="drop-downs" value={isPrivate} onChange={(e) => setisPrivate(e.target.value)}>
                <option value="" disabled selected hidden>(select one)</option>
                <option value="Private">Private</option>
                <option value="Public">Public</option>
            </select>
                {submitted && errors.private ? <p className="errors">{errors.private}</p> : null}
            </label>
            <label>
                <h3 id="price-h3">What is the price for your event?</h3>
                <input placeholder="$ 0" min={0} id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)}></input>
                {submitted && errors.price ? <p className="errors">{errors.price}</p> : null}
            </label>
            <label>
                <h3>When does your event start?</h3>
            <input id="startDate-event" type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)}></input>
                {submitted && errors.startDate? <p className="errors">{errors.startDate}</p> : null}
            </label>
            <h3>When does your event end?</h3>
            <label>
                <input id="startDate-event" type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)}></input>
                {submitted && errors.endDate ? <p className="errors">{errors.endDate}</p> : null}
            </label>
            <label>
                <h3>Please add in image for your event below: (optional)</h3>
                <label className="file-input-cont">
                <FontAwesomeIcon icon={faPlus} />
                Add Image
                <input className="add-image" type="file" onChange={updateFile}></input>
                </label>
                <p id="image-name">{image.name}</p>
                { submitted && errors.image ? <p className="errors">{errors.image}</p>: null}
            </label>
            <h3 id="description-head">Please describe your event:</h3>
            <label>
                <textarea placeholder="Please include at least 30 characters" id="event-description" type="text" value={about} onChange={(e) => setAbout(e.target.value)}></textarea>
                {submitted && errors.about ? <p className="errors">{errors.about}</p> : null}

            </label>
            <div id="button-container-update">

            </div>
            <button onClick={(e) => handleSubmit(e)} id="submit-button" type="submit" value={!update ? "Create Event" : "Edit Event"}>{!update ? "Create Event" : "Save Changes"}</button>

          </form>
          </div>
        </>
    )

}
