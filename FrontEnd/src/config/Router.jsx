import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import DashBoardPage from "../pages/DashBoardPage";
import OTPVerifyPage  from "../auth/OTPVerifyPage";

function Router() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/dashBoard" element={< DashBoardPage/>} />
          <Route path="/otpVerify" element={< OTPVerifyPage/>} />
          <Route path="*" element={<h2>404: Page Not Found!</h2>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default Router;
