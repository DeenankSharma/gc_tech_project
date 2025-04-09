import { Routes,Route, BrowserRouter } from "react-router-dom";
import { ChatPage } from "../pages/ChatPage.tsx";
import  { AuthPage }  from "../pages/AuthBanner.tsx";
import Preferences from "../pages/Preferences.tsx";
import { useAuth0 } from "@auth0/auth0-react";

export const Routes_ = () => {
  const {isAuthenticated,user} = useAuth0()

  if(isAuthenticated){
    console.log("User is authenticated")
    console.log(user)
  }
  
  return (
    <BrowserRouter> 
    <Routes>
      {/* <Route path="/" element={<AuthPage/>} /> */}
      <Route path="/" element={isAuthenticated ? <ChatPage />:<AuthPage/>} />
      <Route path="/chat" element={<ChatPage/>} />
      <Route path="/preferences" element={isAuthenticated ? <Preferences /> : <AuthPage/>} />
      <Route path="/login" element={isAuthenticated ? <ChatPage/> : <AuthPage />} />
    </Routes>
    </BrowserRouter>)
}