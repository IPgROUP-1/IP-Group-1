import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Placeholder from "./pages/Placeholder.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Placeholder title="Login" note="Built by Christ (login frontend)." />} />
      <Route path="/forgot-password" element={<Placeholder title="Forgot password" note="Coming with the login/password backend." />} />
      <Route path="/dashboard" element={<Placeholder title="Dashboard" note="You are signed in. The dashboard comes in a later week." />} />
    </Routes>
  );
}