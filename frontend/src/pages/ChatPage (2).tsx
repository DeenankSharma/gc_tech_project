import HistorySidebar from "../components/HistorySidebar.tsx";
import { Footer } from "../components/Footer.tsx";
import Header from "../components/Header.tsx";
import BannersSidebar from "../components/BannersSidebar.tsx";
import { ChatSection } from "../components/ChatSection.tsx";


export const ChatPage = () => {


  return (
    <>
    <Header />
    <main className="flex flex-row gap-4 py-4">
      <HistorySidebar/>
      <ChatSection/>
      <BannersSidebar/>
    </main>
    <Footer/>
    </>
  );
}