import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Prompting from "./components/Prompting";
import MagicScreen from "./components/MagicScreen";
import Navbar from "./components/Navbar";
import { LoadProvider } from "./state/LoadContext";

const App = () => {
  // Wake up the backend server on app load
  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (backendUrl) {
          console.log('Waking up backend server...');
          await fetch(`${backendUrl}/health`, { method: 'GET' });
          console.log('Backend server is ready');
        }
      } catch (error) {
        console.log('Backend wake-up call sent (server may be starting):', error);
      }
    };

    wakeUpServer();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <LoadProvider>
      <BrowserRouter>
        <Navbar />
        <div className="flex-1 h-screen overflow-auto scrollbar-hidden">
          <Routes>
            <Route path="/" element={<Prompting />} />
            <Route path="/magic" element={<MagicScreen />} />
          </Routes>
        </div>
      </BrowserRouter>
      </LoadProvider>
    </div>
  );
};

export default App;
