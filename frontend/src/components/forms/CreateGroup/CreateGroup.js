import React, {useEffect, useState, useLayoutEffect, useMemo} from "react"
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createGroupAction, createGroupImageAction, updateGroupAction, updateGroupImageAction, getGroupDetails} from "../../../store/groups";
import './CreateGroup.css';
import { reduce } from "lodash";
export default function CreateGroup({update, sessionUser}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();
    let { groupId } = params;
    groupId = parseInt(groupId);

    const currentGroup = useSelector((state) => state.groups.singleGroup);
    const [location, setLocation] = useState("");
    const [state, setState] = useState("AK");
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [type, setType] = useState("");
    const [isPrivate, setisPrivate] = useState("");
    const [image, setImage] = useState("");
    const [errors, setErrors] = useState({});
    const [disabled, setDisabled] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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
        console.log("In submit", disabled);
        if (!disabled) {
            console.log('im not disabled');
        const spaceRemoved = location.replaceAll(' ', '');
        const group = {city:spaceRemoved, state, name, about, type, private:stringToBool(isPrivate)};
        let theImage = {url: "https://logos-world.net/wp-content/uploads/2021/02/Meetup-Logo.png", preview: true};
        if (image) {
            console.log("no images")
             theImage = {url:image, preview: true};
        }
        if (!update) {
            const newGroup = await dispatch(createGroupAction(group));
            const response =  await dispatch(createGroupImageAction(newGroup.id, theImage));
            console.log("THis is the response", response);
            history.push(`/groups/${newGroup.id}`);
        } else if (update) {
            const updatedGroup = await dispatch(updateGroupAction(group, currentGroup.id));
            if (currentGroup.GroupImages) {
                 await dispatch(updateGroupImageAction(currentGroup.GroupImages[0].id, theImage));
            }
            history.push(`/groups/${updatedGroup.id}`);
        }
    }
    }




    useEffect(() => {
        if (update) {

            dispatch(getGroupDetails(groupId));
            setLocation(`${currentGroup.city}`);
            setState(currentGroup.state)
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
        const tempErrors = {};
        console.log("use effect is running")
        if (location.replaceAll(' ', '') === "") {
            tempErrors.location = "City is required";
        }

        if (name.replaceAll(' ', '') === "") {
            tempErrors.name = "Name is required";
        }
        if (about.length < 30 || about.replaceAll(' ', '') === '') {
            tempErrors.about = "Description must be at least 30 characters long";
        }
        if (type.replaceAll(' ', '') === "") {
            tempErrors.type = "Group Type is required";
        }
        if (isPrivate.replaceAll(' ', '') === "") {
            tempErrors.private = "Visibility Type is required";
        }
        if (image) {
        if (!["jpg", "jpeg", "png"].includes(image.slice(image.length - 5).split(".")[1])) {
            tempErrors.image = "Image URL must end in .png, .jpg, or .jpeg";
        }
        }
        setErrors(tempErrors);
        if (Object.keys(tempErrors).length === 0) {

            setDisabled(false);
        } else {
            setDisabled(true);

        }
    }, [location, name, about, type, isPrivate, image, submitted]);

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
        { !update ? <h3>Start a New Group</h3> : <h3>Update your group's information</h3>}
        { !update ? <h1>We'll walk you through a few steps to build your local community</h1> : <h1>We'll walk you through a few steps to update your group's information</h1>}
        </div>
        <form id="create-group-form"
        onSubmit={handleSubmit}>
        <label id="first-label">
        <h1>First, set your group's location</h1>
        <p id="firstP">Meetup groups meet locally, in person and online. We'll connect you with people</p>
        <p id="secondP">in your area, and more can join you online.</p>
        <div id="location-cont">
        <input placeholder="City" type="text" value={location} onChange={(e) => setLocation(e.target.value)}/>
        <select name="state" size="1" value={state} onChange={(e) => setState(e.target.value)}>

  <option value="AK">AK</option>
  <option value="AL">AL</option>
  <option value="AR">AR</option>
  <option value="AZ">AZ</option>
  <option value="CA">CA</option>
  <option value="CO">CO</option>
  <option value="CT">CT</option>
  <option value="DC">DC</option>
  <option value="DE">DE</option>
  <option value="FL">FL</option>
  <option value="GA">GA</option>
  <option value="HI">HI</option>
  <option value="IA">IA</option>
  <option value="ID">ID</option>
  <option value="IL">IL</option>
  <option value="IN">IN</option>
  <option value="KS">KS</option>
  <option value="KY">KY</option>
  <option value="LA">LA</option>
  <option value="MA">MA</option>
  <option value="MD">MD</option>
  <option value="ME">ME</option>
  <option value="MI">MI</option>
  <option value="MN">MN</option>
  <option value="MO">MO</option>
  <option value="MS">MS</option>
  <option value="MT">MT</option>
  <option value="NC">NC</option>
  <option value="ND">ND</option>
  <option value="NE">NE</option>
  <option value="NH">NH</option>
  <option value="NJ">NJ</option>
  <option value="NM">NM</option>
  <option value="NV">NV</option>
  <option value="NY">NY</option>
  <option value="OH">OH</option>
  <option value="OK">OK</option>
  <option value="OR">OR</option>
  <option value="PA">PA</option>
  <option value="RI">RI</option>
  <option value="SC">SC</option>
  <option value="SD">SD</option>
  <option value="TN">TN</option>
  <option value="TX">TX</option>
  <option value="UT">UT</option>
  <option value="VA">VA</option>
  <option value="VT">VT</option>
  <option value="WA">WA</option>
  <option value="WI">WI</option>
  <option value="WV">WV</option>
  <option value="WY">WY</option>
</select>
</div>
        </label>
        { submitted && errors.location ? <p className="errors">{errors.location}</p>: null}
        { submitted && errors.state ? <p className="errors">{errors.state}</p>: null}
        <label>
        {!update ? <h1>What will your group's name be?</h1> : <h1>What is the name of your group?</h1>}
        <p>Choose a name that will give people a clear idea of what the group is about.</p>
        { !update ? <p>Feel free to get creative! You can edit this later if you change your mind.</p> : <p>Feel free to get creative!</p>}
        <input placeholder="What is your group name?" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        { submitted && errors.name? <p className="errors">{errors.name}</p>: null}
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
        { submitted && errors.about ? <p className="errors">{errors.about}</p>: null}
        <label>
        <h1>Final steps...</h1>
        <p>Is this an in person or online group?</p>
        <select value={type} name="options" onChange={(e) => setType(e.target.value)}>
        <option value="" disabled selected hidden>(select one)</option>
        <option value='In person'>In person</option>
        <option value='Online'>Online</option>
        </select>
        { submitted && errors.type ? <p className="errors">{errors.type}</p>: null}
        <p>Is this group private or public?</p>
        <select value={isPrivate}  onChange={(e) => setisPrivate(e.target.value)} name="options">
        <option value="" disabled selected hidden>(select one)</option>
        <option value="Private">Private</option>
        <option value="Public">Public</option>
        </select>
        { submitted && errors.private? <p className="errors">{errors.private}</p>: null}
        <p>Please add an image url for your group below: (optional)</p>
        <input placeholder="Image Url" type="text" value={image} onChange={(e) => setImage(e.target.value)}/>
        </label>
        { submitted && errors.image ? <p className="errors">{errors.image}</p>: null}
        <div id="button-container-create">
        <input id="submit-button" type="submit" value={!update ? "Create group" : "Update group"}/>
        </div>
        </form>
        </div>
        </>
    )
}
