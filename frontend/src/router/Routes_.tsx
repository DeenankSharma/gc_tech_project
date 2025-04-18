import { Routes,Route, BrowserRouter } from "react-router-dom";
import { ChatPage } from "../pages/ChatPage.tsx";
import  { AuthPage }  from "../pages/AuthBanner.tsx";
import Preferences from "../pages/Preferences.tsx";
import { useAuth0 } from "@auth0/auth0-react";
import { usePreference } from "../hooks/preferenceContext.tsx";
import { Navigate } from "react-router-dom";
import PlayerStatsTable from "../components/Stat_table.tsx";
import LiveMatchBanner from "../components/LivematchBanners.tsx";
import CricketStandings from "../components/Points_Table.tsx";

export const Routes_ = () => {

  const {isAuthenticated} = useAuth0()
  const {preference} = usePreference()

  return (
    <BrowserRouter> 
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/login"/> : <AuthPage />} />
      <Route path="/chat" element={isAuthenticated  ? <ChatPage /> : <AuthPage />} />
      <Route path="/preferences" element={<Preferences/>} />
      <Route path="/login" element={!isAuthenticated ? <AuthPage/>: preference==true ? <ChatPage/> : <Preferences/> } />
      <Route path="/player_stats" element={<PlayerStatsTable/>} />
      <Route path="/live_match" element={
  <LiveMatchBanner 
    teamA={{
      name: "Team A",
      logo: "/placeholder.svg?height=40&width=40",
      score: "120/3",
      color: "#ff5e5b",
    }}
    teamB={{
      name: "Team B",
      logo: "/placeholder.svg?height=40&width=40",
      score: "95/2",
      color: "#5271ff",
    }}
    updates={[
      { text: "Team B needs 26 runs in 18 balls", isImportant: true }, 
      { text: "Last wicket: Smith (34)" }
    ]}
    isLive={true}
  />
} />
      <Route path="/points_table" element={<CricketStandings/>} />
    </Routes>
    </BrowserRouter>)
}