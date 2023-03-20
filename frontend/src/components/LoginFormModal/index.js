import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import DemoLogin from "./signinDemo";
function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  let [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

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
      <h1>Log In</h1>
      </span>
      <div className="login-form-cont">
      <form id="login-form" onSubmit={handleSubmit}>
        <ul className="errors login-errors">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          <input
          placeholder="Username or Email"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>

          <input
          placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button id={credential.length < 4 || password.length < 6 ? "inactive" : "active"}disabled={credential.length < 4 || password.length < 6} type="submit">Log In</button>
      </form>
      </div>
      <DemoLogin onItemClick={closeModal}>Demo</DemoLogin>
      </div>
    </>
  );
}

export default LoginFormModal;
