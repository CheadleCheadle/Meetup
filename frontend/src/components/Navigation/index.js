

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useState, useRef} from "react"
import './Navigation.css';

function Navigation({ isLoaded }){
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
        <div className="home">
        <NavLink exact to="/">Yeetup</NavLink>
        </div>
        </div>
        <div className="nav-second">
        <div className={isLoggedInIcon}>
          {isLoaded && !sessionUser && (
          <div className ="login-signup-cont">
          <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
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
