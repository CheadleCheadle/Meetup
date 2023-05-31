import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './SignupForm.css';
import LoginFormModal from "../LoginFormModal";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import DemoLogin from "../LoginFormModal/signinDemo";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  let [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const { setModalContent, setOnModalClose } = useModal();
  const handleSubmit = (e) => {
    e.preventDefault();
    validateBody();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  const handleDisable = () => {
    if (firstName === "") return true;
    if ( lastName === "") return true;
    if (username.length < 4) return true;
    if (password.length < 6) return true;
    if (password !== confirmPassword) return true;
  }

  const validateBody = () => {
    const tempArr = [];
    if (email === "") {
      tempArr.push("Please Provide an email");
    }
    if (username === "") {
      tempArr.push("Please Provide a username");
    }
    if (firstName === "") {
      tempArr.push("Please Provide a firstname");
    }
    if (lastName === "") {
      tempArr.push("Please Provide a lastname")
    }
    if (password === "") {
      tempArr.push("Please provide a password")
    }
    if (confirmPassword === "") {
      tempArr.push("Please confirm password");
    }
    return setErrors(...errors, ...tempArr);
  }
  errors = Object.values(errors);


  return (
    <>
    <div className="signup-modal-wrap">
      <span className="header-text-signup">
      <h1>Sign Up</h1>
      <span id="not-members">
      <p>Already a member? </p>
      <Link onClick={() => setModalContent(<LoginFormModal />)}>Log in</Link>
      or
      <DemoLogin id="signup-demo" onItemClick={closeModal}>Demo</DemoLogin>
      </span>
      </span>
      <div className="signup-form-cont">
      <form id="login-form" onSubmit={handleSubmit}>
        <ul className="errors">
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label>
          Email address
        </label>
          <input
            placeholder="example@email.com"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        <label>
          Username
        </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        <label>
          Your first name
        </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        <label>
          Your last name
        </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        <label>
          Password
        </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        <label>
          Confirm Password
        </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        <button id={handleDisable() ? "inactive" : "active"}disabled={handleDisable()} type="submit">Sign Up</button>
      </form>
      </div>
      </div>
    </>
  );
}

export default SignupFormModal;
