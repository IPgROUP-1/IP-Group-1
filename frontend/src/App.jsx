import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/authentication/login.jsx';
import Signup from './components/authentication/Signup.jsx';
import Placeholder from './components/authentication/Placeholder.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/forgot-password"
        element={<Placeholder title="Forgot password" note="Coming with the login/password backend." />}
      />
      <Route
        path="/dashboard"
        element={<Placeholder title="Dashboard" note="You are signed in. The dashboard comes in a later week." />}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;