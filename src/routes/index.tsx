import React from 'react';
import {Routes, Route, Navigate} from "react-router-dom";
// import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/home/home";
import TestForm from "../pages/testForm/testForm";
import SignIn from "../pages/user/SignIn";
import SignUp from "../pages/user/SignUp";
import Result from "../pages/result/result";



function MyRoutes() {
    return (
        <>
            <Routes>
                <Route path="/login" element={<SignIn />} />
                <Route path="/signup" element={<SignUp/>} />
                <Route path="/" element={<Home/>} />
                <Route path="/exam" element={<TestForm/>} />
                <Route path="/result" element={<Result />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    )
}

export default MyRoutes