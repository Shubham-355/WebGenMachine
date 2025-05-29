import { useState } from "react";
import FileStructure from "./FileStructure";
import PromptStatus from "./PromptStatus";
import CodeComponent from "./CodeComponent";
import Preview from "./Preview";

const MagicScreen = () => {
  const [selectedComponent, setSelectedComponent] = useState("Preview");

  return (
    <div className="flex h-[99%] bg-black">
      <div className="w-1/5 p-4 border-r border-gray-300">
        <div className="text-xl font-bold mb-4">
          <PromptStatus />
        </div>
      </div>

      <div className="w-1/5 p-4 border-r border-gray-300">
        <div className="text-lg text-gray-700">
          <FileStructure />
        </div>
      </div>
      
      <div className="flex-1 p-4 flex flex-col">
        <div className="mb-4">
          <div className="flex space-x-2">
            <button 
              className={`relative inline-flex h-10 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 ${selectedComponent === "Preview" ? "" : "border border-gray-600"}`}
              onClick={() => setSelectedComponent("Preview")}
            >
              {selectedComponent === "Preview" && (
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              )}
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white backdrop-blur-3xl">
                Preview
              </span>
            </button>
            <button 
              className={`relative inline-flex h-10 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 ${selectedComponent === "CodeComponent" ? "" : "border border-gray-600"}`}
              onClick={() => setSelectedComponent("CodeComponent")}
            >
              {selectedComponent === "CodeComponent" && (
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              )}
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white backdrop-blur-3xl">
                Code
              </span>
            </button>
          </div>
        </div>
        
        <div className="flex-1 bg-black rounded-lg shadow-md p-4">
          {selectedComponent === "Preview" ? <Preview /> : <CodeComponent />}
        </div>
      </div>
    </div>
  );
}

export default MagicScreen;