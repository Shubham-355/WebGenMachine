import { BrowserRouter, Route, Routes } from "react-router-dom";
import Prompting from "./components/Prompting";
import MagicScreen from "./components/MagicScreen";
import Navbar from "./components/Navbar";
import { LoadProvider } from "./state/LoadContext";

const App = () => {
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
