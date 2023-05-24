import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useHistory } from "react-router-dom";
import "./Navigation.css";
function ProfileButton({ user }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.replace(`/`);
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const profileClassName = "profile-icons" + (showMenu ? " fixed" : "");
  return (
    <>
    <div className="profile-wrap">
      <div onClick={openMenu} className={profileClassName}>
      <i className="fas fa-user-circle" onClick={openMenu}/>
    <FontAwesomeIcon className={!showMenu ? "active-up" : "inactive-up"} icon={faAngleDown} />
    <FontAwesomeIcon className={!showMenu ? "inactive-down" : "active-down"} icon={faAngleUp}/>
      </div>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>Hello, {user.firstName}</li>
            <li>{user.email}</li>
            <li id="view-groups"onClick={() => history.push(`/groups`)}>View Groups</li>
            <li id="view-groups"onClick={() => history.push(`/events`)}>View Events</li>
            <li id="logout">
              <p onClick={logout}>Log Out</p>
            </li>
          </>
        ) : (
          <>
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
          </>
        )}
      </ul>
      </div>
    </>
  );
}

export default ProfileButton;
