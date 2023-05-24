

import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useState, useRef} from "react"
import './Navigation.css';

function Navigation({ isLoaded }){
  const history = useHistory();
      const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();


      const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
  const sessionUser = useSelector(state => state.session.user);
  const isLoggedIn = "nav-bar" + !sessionUser ? " noLogin" : "";
  const isLoggedInIcon = "container" + sessionUser ? " login" : "";
  return (

      <nav className={isLoggedIn}>
        <div className="nav-first">
        <div className="home" onClick={() => history.push('/')}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/57/Meetup_1.svg"></img>
        </div>
        </div>
        <div className="nav-second">
          { sessionUser ? <span onClick={() => history.push(`/groups/new`)} id="start-new-group">Start a new group</span> : null}
        <div className={isLoggedInIcon}>
          {isLoaded && !sessionUser && (
          <div className ="login-signup-cont">
          <OpenModalMenuItem
              itemText="Log in"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
              className="login-button"
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
              className="signup-button"
            />
          </div>)}

        <div className="profile">
          {isLoaded && sessionUser &&  (<ProfileButton user={sessionUser} />)}
          </div>
          </div>
        </div>
    </nav>

  );
}

export default Navigation;
