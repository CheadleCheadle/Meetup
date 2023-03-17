import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

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
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button disabled={handleDisable()} type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;
