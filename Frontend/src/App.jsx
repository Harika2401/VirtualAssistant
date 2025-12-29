import React,{useContext} from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Customize from "./pages/Customize";
import Home from "./pages/Home";
import { userDataContext } from "./context/UserContext"; 
import Customize2 from "./pages/Customize2";

function App() {
  const { userData, loading } = useContext(userDataContext);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <Routes>

      {/* ROOT */}
      <Route
        path="/"
        element={
          !userData
            ? <Navigate to="/signin" />
            : (userData.assistantName && userData.assistantImage)
                ? <Home />
                : <Navigate to="/customize" />
        }
      />

      {/* AUTH */}
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/" />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to="/" />}
      />

      {/* CUSTOMIZATION */}
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to="/signin" />}
      />
      <Route
        path="/customize2"
        element={userData ? <Customize2 /> : <Navigate to="/signin" />}
      />

    </Routes>
  );
}


export default App
