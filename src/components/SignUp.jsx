import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
    const navigate = useNavigate();
    const [user_id, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        const user = {
            user_id,
            password,
            name
        };

        try {
            const response = await axios.post(
                "/api/signup",
                user
            );

            if(response.data.success) {
                setMessage("Account created successfully");
                setTimeout(()=>{
                    navigate("/signin");
                },1000);
            } 
            else {
                setMessage(response.data.message);
            }
        } 
        catch(error) {
            setMessage("Server error");
        }
    }

    return (

        <div className="form-container">

            <h2 className="page-title">
                Sign Up
            </h2>

            <form onSubmit={handleSubmit}>

                <label>
                    User ID
                </label>

                <input
                    type="text"
                    value={user_id}
                    onChange={(e)=>setUserId(e.target.value)}
                    placeholder="Enter user ID"
                    required
                />

                <label>
                    Name
                </label>

                <input
                    type="text"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    placeholder="Enter name"
                    required
                />

                <label>
                    Password
                </label>

                <input
                    type="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                />

                <button 
                className="btn btn-primary"
                type="submit"
                >
                    Create Account
                </button>

            </form>

            {
                message &&
                <div className="alert alert-info mt-3">
                {message}
                </div>
            }

        </div>
    );
}
export default SignUp;
