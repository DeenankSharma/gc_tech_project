import { Routes,Route, BrowserRouter } from "react-router-dom";
import { ChatPage } from "../pages/ChatPage.tsx";
import { LoginPage } from "../pages/LoginPage.tsx";
import { RegisterPage } from "../pages/RegisterPage.tsx";
import Preferences from "../pages/Preferences.tsx";

export const Routes_ = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/p" element={<ChatPage />} />
      <Route path="/" element={<Preferences />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
    </BrowserRouter>)
}