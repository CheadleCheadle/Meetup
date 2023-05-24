import React from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import "./LoginForm.css";

export default function DemoLogin({onItemClick}) {
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
         onItemClick();
        return dispatch(sessionActions.login({credential: "Demo-lition", password: "password"}))

    }
    return (
        <h3 id="demo-user"
        onClick={handleSubmit}>
             Demo User
        </h3>
    )
}
