import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();
  const [user_id, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
        e.preventDefault();
        const loginData = {
        user_id,
        password
        };

        try {
        const response = await axios.post(
                "/api/signin",
                loginData
            );

        if(response.data.success) {
                localStorage.setItem(
                "user",
                response.data.user.user_id
                );

                setMessage("Login successful");

                setTimeout(()=>{
                    navigate("/");
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
                Sign In
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
                type="submit"
                className="btn btn-success"
                >
                    Sign In
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
export default SignIn;