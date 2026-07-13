import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  function logout() {
        localStorage.removeItem("user");
        navigate("/signin");
    }

  return (

    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

        <div className="container">

            <Link 
            className="navbar-brand" to="/"
            >
            Blog Application
            </Link>

            <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            >
            <span className="navbar-toggler-icon"></span>
            </button>

            <div 
                className="collapse navbar-collapse" 
                id="navbarNav"
                >

                <ul className="navbar-nav ms-auto">


                    <li className="nav-item">
                    <Link 
                        className="nav-link" 
                        to="/"
                    >
                        Home
                    </Link>
                    </li>



                    {!user && (
                    <>
                        <li className="nav-item">
                        <Link 
                            className="nav-link" 
                            to="/signup"
                        >
                            Sign Up
                        </Link>
                        </li>


                        <li className="nav-item">
                        <Link 
                            className="nav-link" 
                            to="/signin"
                        >
                            Sign In
                        </Link>
                        </li>
                    </>
                    )}



                    {user && (
                    <li className="nav-item">
                        <button
                        className="btn btn-danger btn-sm mt-1"
                        onClick={logout}
                        >
                        Logout
                        </button>
                    </li>
                    )}

                </ul>

            </div>

        </div>

    </nav>
  );
}

export default Navbar;