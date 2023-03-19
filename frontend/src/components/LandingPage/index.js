
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
            <div className="landing-message">
                <h1>The people platform-Where interests become friendships</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                   sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                   quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                   Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                   Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
            <div className="image-container">
                <img src={image}></img>
            </div>
            </div>
            <div className="description-middle">
                <h2>How Meetup works</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div className="landing-nav">
                <div className="see-groups">
                <img src={handsUp}></img>
                <NavLink to="/groups">See all groups</NavLink>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>

                <div className="find-event">
                <img src={ticket}></img>
                <NavLink to="/events">Find an event</NavLink>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>

                <div className="start-group">
                <img src={group}></img>
                <NavLink to="/groups/new" className={handleStartNewGroup} onClick={(e) => !sessionUser ? e.preventDefault() : undefined}>Start a new group</NavLink>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
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
