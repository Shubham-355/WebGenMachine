import { BrowserRouter, Route, Routes } from "react-router-dom";
import Prompting from "./components/Prompting";
import MagicScreen from "./components/MagicScreen";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <BrowserRouter>
        <Navbar />
        <div className="flex-1 h-screen overflow-auto scrollbar-hidden">
          <Routes>
            <Route path="/" element={<Prompting />} />
            <Route path="/magic" element={<MagicScreen />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
