import React, {useEffect, useState, useLayoutEffect, useMemo} from "react"
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createGroupAction, createGroupImageAction, updateGroupAction, updateGroupImageAction, getGroupDetails} from "../../../store/groups";
import './CreateGroup.css';
export default function CreateGroup({update, sessionUser}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();
    let { groupId } = params;
    groupId = parseInt(groupId);

    const currentGroup = useSelector((state) => state.groups.singleGroup);
    const [location, setLocation] = useState("");
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [type, setType] = useState("");
    const [isPrivate, setisPrivate] = useState("");
    const [image, setImage] = useState("");
    const [errors, setErrors] = useState({});


    const stringToBool = (bool) => {
        if (bool === "Private") {
            return true
        } else {
            return false
        }
    }
    const handleSubmit = async (e) => {
        validation();
        e.preventDefault();
        const spaceRemoved = location.replaceAll(' ', '');
        const split = spaceRemoved.split(',')
        const group = {city:split[0], state:split[1].slice(0,2).toUpperCase(), name, about, type, private:stringToBool(isPrivate)};
        const theImage = {url:image, preview: true};
        if (!update) {
        const newGroup = await dispatch(createGroupAction(group));
        await dispatch(createGroupImageAction(newGroup.id, theImage));
         history.push(`/groups/${newGroup.id}`);
        } else if (update) {
            const updatedGroup = await dispatch(updateGroupAction(group, currentGroup.id));
            if (currentGroup.GroupImages) {
            await dispatch(updateGroupImageAction(currentGroup.GroupImages[0].id, theImage));
            }
            history.push(`/groups/${updatedGroup.id}`);
        }
    }

    const validation = () => {
        const tempErrors = {};
        if (location === "") {
            tempErrors.location = "Location is required";
        }
        if (name === "") {
            tempErrors.name = "Name is required";
        }
        if (about.length < 30) {
            tempErrors.about = "Description must be at least 30 characters long";
        }
        if (type === "") {
            tempErrors.type = "Group Type is required";
        }
        if (isPrivate === "") {
            tempErrors.private = "Visibility Type is required";
        }
        if (!["jpg", "jpeg", "png"].includes(image.slice(image.length - 5).split(".")[1])) {
            tempErrors.image = "Image URL must end in .png, .jpg, or .jpeg";
        }
        setErrors(tempErrors);
    }



    useEffect(() => {
        dispatch(getGroupDetails(groupId));
        if (update) {
        setLocation(`${currentGroup.city}, ${currentGroup.state}`);
        setName(currentGroup.name);
        setAbout(currentGroup.about);
        setType(currentGroup.type);
        setisPrivate(currentGroup.private === true ? "Private" : "Public");
        if (currentGroup.GroupImages.length > 0) {
        setImage(currentGroup.GroupImages[0].url);
        }
    }
    },[])

    useEffect(() => {
        validation();
    }, [location, name, about, type, isPrivate, image]);

    useEffect(() => {
        setErrors([]);
    }, []);


    if (update && currentGroup.organizerId !== sessionUser.id) {
        history.push("/");
    }
    if (!sessionUser) {
        history.replace("/");
    }

    return (
        <>
        <div className="create-group-wrap">
        <div className="organizer-div">
            { !update ? <h3>Become an Organizer</h3> : <h3>Update your group's information</h3>}
            { !update ? <h1>We'll walk you through a few steps to build your local community</h1> : <h1>We'll walk you through a few steps to update your group's information</h1>}
        </div>
        <form id="create-group-form"
        onSubmit={handleSubmit}>
            <label id="first-label">
                <h1>First, set your group's location</h1>
                <p id="firstP">Meetup groups meet locally, in person and online. We'll connect you with people</p>
                 <p id="secondP">in your area, and more can join you online.</p>
                <input placeholder="City, STATE" type="text" value={location} onChange={(e) => setLocation(e.target.value)}/>
            </label>
            <p className={errors.location ? "errors": "handleBlank"}>{errors.location || "Blank filler text"}</p>
            <label>
                {!update ? <h1>What will your group's name be?</h1> : <h1>What is the name of your group?</h1>}
                <p>Choose a name that will give people a clear idea of what the group is about.</p>
                { !update ? <p>Feel free to get creative! You can edit this later if you change your mind.</p> : <p>Feel free to get creative!</p>}
                <input placeholder="What is your group name?" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <p className={errors.name ? "errors" : "handleBlank"}>{errors.name || "Blank filler text"}</p>
            <label>
                <h1>Now describe what your group will be about</h1>
                { !update ? <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p> : <p>People will see this when we promote your group.</p>}
                <ol>
                    <li>What's the purpose of the group?</li>
                    <li>Who should join?</li>
                    <li>What will you do at your events?</li>
                </ol>
                <textarea placeholder="Please write atleast 30 characters"type="text" value={about} onChange={(e) => setAbout(e.target.value)}></textarea>
            </label>
            <p className={errors.about ? "errors" : "handleBlank"}>{errors.about || "Blank filler text"}</p>
            <label>
                <h1>Final steps...</h1>
                <p>Is this an in person or online group?</p>
                <select value={type} name="options" onChange={(e) => setType(e.target.value)}>
                    <option value="" disabled selected hidden>(select one)</option>
                    <option value='In person'>In person</option>
                    <option value='Online'>Online</option>
                </select>
                <p className={errors.type ? "errors" : "handleBlank"}>{errors.type || "Blank filler text"}</p>
                <p>Is this group private or public?</p>
                <select value={isPrivate}  onChange={(e) => setisPrivate(e.target.value)} name="options">
                    <option value="" disabled selected hidden>(select one)</option>
                    <option value="Private">Private</option>
                    <option value="Public">Public</option>
                </select>
                <p className={errors.type ? "errors" : "handleBlank"}>{errors.private || "Blank filler text"}</p>
                <p>Please add an image url for your group below:</p>
                <input placeholder="Image Url" type="text" value={image} onChange={(e) => setImage(e.target.value)}/>
            </label>
            <p className={errors.image ? "errors" : "handleBlank"}>{errors.image || "Blank filler text"}</p>
            <div id="button-container-create">
            <input id="submit-button" disabled ={Object.values(errors).length}  type="submit" value={!update ? "Create group" : "Update group"}/>
            </div>
        </form>
        </div>
        </>
    )
}
