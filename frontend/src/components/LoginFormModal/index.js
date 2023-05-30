import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import DemoLogin from "./signinDemo";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import SignupFormModal from "../SignupFormModal";
function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  let [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const { setModalContent, setOnModalClose } = useModal();
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data) setErrors({errors: data.message});
        }
      );
  };

errors = Object.values(errors);
  return (
    <>
    <div className="login-modal-wrap">
      <span className="header-text">
        <div id="icon-cont">
        <img src="https://img.icons8.com/ios/50/F64060/meetup.png" alt="meetup"/>
        </div>
      <h1>Log In</h1>
      <span id="not-members">
      <p>Not a member yet? </p>
      <Link onClick={() => setModalContent(<SignupFormModal />)}>Sign up</Link>

      </span>
      </span>
      <div className="login-form-cont">
      <form id="login-form" onSubmit={handleSubmit}>
        <ul className="errors login-errors">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Email or Username
        </label>
          <input

            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
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
        <button id={credential.length < 4 || password.length < 6 ? "inactive" : "active"}disabled={credential.length < 4 || password.length < 6} type="submit">Log In</button>
      </form>
      </div>
      <DemoLogin onItemClick={closeModal}>Demo</DemoLogin>
      </div>
    </>
  );
}

export default LoginFormModal;
