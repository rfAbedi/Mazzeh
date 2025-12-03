import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RTLProvider from "./ThemeProvider";
import LoginPage from "./components/Login";
import UserSignUp from "./components/User/SignUp";
import RestaurantSignUp from "./components/Restaurant/SignUp";
import UserProvider from "./contexts/UserContext";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <RTLProvider>
        <UserProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/customer/signup" element={<UserSignUp />} />
              <Route path="/restuarant/signup" element={<RestaurantSignUp />} />
              <Route path="/" element={<div>Home</div>} />
            </Routes>
          </Router>
        </UserProvider>
      </RTLProvider>
    </div>
  );
}

export default App;
