import { create } from "lodash";
import React, {useEffect, useState} from "react"
import { useDispatch } from "react-redux";
import { createGroupAction } from "../../store/groups";
export default function CreateGroup() {
    const dispatch = useDispatch();
    const [location, setLocation] = useState("");
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [type, setType] = useState("In person");
    const [isPrivate, setisPrivate] = useState(true);
    const [image, setImage] = useState("");
    useEffect(() => {
        console.log(typeof type, type);
    }, [location, name, about, type, isPrivate, image])

    const handleSubmit = (e) => {
        e.preventDefault();
        const spaceRemoved = location.replaceAll(' ', '');
        const split = spaceRemoved.split(',')
        const group = {city:split[0], state:split[1], name, about, type, private:isPrivate}
        console.log('HANDLE SUBMIT',group);
        dispatch(createGroupAction(group))
    }
    return (
        <>
        <div>
            <h3>Become an Organizer</h3>
            <h1>We'll walk you through a few steps to build your local community</h1>
        </div>
        <form
        onSubmit={handleSubmit}>
            <label>
                <h1>First, set your group's location</h1>
                <p>Meetup groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online.</p>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}/>
            </label>
            <label>
                <h1>What will your group's name be?</h1>
                <p>Choose aname that will give people a clear idea of what the group is about.</p>
                <p>Feel free to get creative! You can edit this later if you change your mind.</p>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
                <h1>Now describe what your group will be about</h1>
                <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
                <ol>
                    <li>What's the purpose of the group?</li>
                    <li>Who should join?</li>
                    <li>What will you do at your events?</li>
                </ol>
                <textarea type="text" value={about} onChange={(e) => setAbout(e.target.value)}></textarea>
            </label>
            <label>
                <h1>Final steps...</h1>
                <p>Is this an in person or online group?</p>
                <select value={type} name="options" onChange={(e) => setType(e.target.value)}>
                    <option value='In person'>In person</option>
                    <option value='Online'>Online</option>

                </select>
                <p>Is this group private or public?</p>
                <select value={isPrivate}  onChange={(e) => e.target.value==="Private"? setisPrivate(true): setisPrivate(false)}name="options">
                    <option value="Private">Private</option>
                    <option value="public">Public</option>
                </select>
                <p>Please add an image url for your group below:</p>
                <input type="text" value={image} onChange={(e) => setImage(e.target.value)}/>
            </label>
            <input type="submit" value="Create group"/>
        </form>
        </>
    )
}
