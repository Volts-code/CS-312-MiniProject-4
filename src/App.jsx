import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import EditPost from "./components/EditPost";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <div className="container mt-4">

        <Routes>

          <Route 
            path="/" 
            element={<Home />} 
          />

          <Route 
            path="/signup" 
            element={<SignUp />} 
          />

          <Route 
            path="/signin" 
            element={<SignIn />} 
          />

          <Route 
            path="/edit/:id" 
            element={<EditPost />} 
          />

        </Routes>

      </div>

    </BrowserRouter>
  );
}
export default App;