
import './LandingPage.css';
import image from "../../images/online_events.jpg";
import handsUp from "../../images/handsUp.jpg";
import ticket from "../../images/ticket.jpg";
import group from "../../images/joinGroup.jpg";
import { NavLink } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton';
import SignupFormModal from '../SignupFormModal';
export default function Landing({sessionUser}) {

    const handleStartNewGroup = () => {
        if (!sessionUser) {
            return `disabled`;
        } else {
            return 'clickable';
        }
    }

    return (
        <main>
            <div className="first-container">
                <img id="right-blob" src="https://secure.meetupstatic.com/next/images/blobs/green-blob.svg"></img>
                <img id="center-blob" src="https://secure.meetupstatic.com/next/images/blobs/yellow-blob.svg"></img>
                <img id="left-blob" src="https://secure.meetupstatic.com/next/images/blobs/red-blob.svg"></img>
            <div className="landing-message">
                <h1>The people platform-Where interests become friendships</h1>
                <p>Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meetup. Events are happening every day—sign up to join the fun.</p>
            </div>
            <div className="image-container">
                <img src={image}></img>
            </div>
            </div>
            <div className="description-middle">
                <h2>How Meetup works</h2>
                <p>Meet new people who share your interests through online and in-person events. It’s free to create an account.</p>
            </div>
            <div className="landing-nav">
                <div className="see-groups">
                <img src="https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=256"></img>
                <NavLink to="/groups">See all groups</NavLink>
                <p>Do what you love, meet others who love it, find your community. The rest is history!</p>
                </div>

                <div className="find-event">
                <img src="https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=256"></img>
                <NavLink to="/events">Find an event</NavLink>
                <p>Events are happening on just about any topic you can think of, from online gaming and photography to yoga and hiking.</p>
                </div>

                <div className="start-group">
                <img src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=256"></img>
                <NavLink to="/groups/new" className={handleStartNewGroup} onClick={(e) => !sessionUser ? e.preventDefault() : undefined}>Start a new group</NavLink>
                <p>You don’t have to be an expert to gather people together and explore shared interests.</p>
                </div>
            </div>
            { !sessionUser ?
            <div className="button-container">
                <OpenModalButton buttonText={"Join Meetup"} modalComponent={<SignupFormModal></SignupFormModal>}></OpenModalButton>
            </div>
            : null }

        </main>
    )
}
