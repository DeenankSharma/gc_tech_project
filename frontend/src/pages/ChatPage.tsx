import HistorySidebar from "../components/HistorySidebar.tsx";
import { Footer } from "../components/Footer.tsx";
import Header from "../components/Header.tsx";
import BannersSidebar from "../components/BannersSidebar.tsx";
import { ChatSection } from "../components/ChatSection.tsx";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

export const ChatPage = () => {

  const {user,getAccessTokenSilently} = useAuth0()

  async function fetchHistory(id: number) {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/history/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          email: user?.email
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching history with id ${id}:`, error);
      throw error;
    }
  }
  
  return (
    <>
    <Header />
    <main className="flex flex-row gap-4 py-4">
      <HistorySidebar func_to_fetch_History={fetchHistory}/>
      <ChatSection/>
      <BannersSidebar/>
    </main>
    <Footer/>
    </>
  );
}