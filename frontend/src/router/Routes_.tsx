import { Routes,Route, Router, BrowserRouter } from "react-router-dom";
import { ChatPage } from "../pages/ChatPage.tsx";
import { LoginPage } from "../pages/LoginPage.tsx";
import { RegisterPage } from "../pages/RegisterPage.tsx";

export const Routes_ = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<ChatPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
    </BrowserRouter>)
}