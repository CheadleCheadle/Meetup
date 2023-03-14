
import './LandingPage.css';
import image from "../../images/graph.jpg"
export default function Landing() {
    return (
        <main>
            <div className="first-container">
            <div className="landing-message">
                <h1>The people platform Where interests become friendships</h1>
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
        </main>
    )
}
