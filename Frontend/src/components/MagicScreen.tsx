import { useState, useEffect, useRef } from "react";
import FileStructure from "./FileStructure";
import PromptStatus from "./PromptStatus";
import CodeComponent from "./CodeComponent";
import Preview from "./Preview";
import { useLocation } from "react-router-dom";
import { useLoad } from "../state/LoadContext";

const MagicScreen = () => {
  const [selectedComponent, setSelectedComponent] = useState("Preview");
  const [parsedFiles, setParsedFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const previewRef = useRef<any>(null);
  
  const location = useLocation();
  const { steps, prompt } = location.state || {};
  const { setCurrentStep, setTotalSteps } = useLoad();

  useEffect(() => {
    if (steps) {
      parseStepsToFiles(steps);
    }
  }, [steps]);

  const parseStepsToFiles = (stepsText: string) => {
    try {
      // Extract boltActions from the steps
      const actionRegex = /<boltAction type="file" filePath="([^"]+)">([\s\S]*?)<\/boltAction>/g;
      const files: any[] = [];
      let match;

      while ((match = actionRegex.exec(stepsText)) !== null) {
        const filePath = match[1];
        const content = match[2].trim();
        
        files.push({
          name: filePath.split('/').pop(),
          path: filePath,
          content: content,
          type: 'file'
        });
      }

      // Extract shell commands for progress tracking
      const shellRegex = /<boltAction type="shell">([\s\S]*?)<\/boltAction>/g;
      const shellCommands: string[] = [];
      
      while ((match = shellRegex.exec(stepsText)) !== null) {
        shellCommands.push(match[1].trim());
      }

      console.log('Parsed files:', files);
      setParsedFiles(files);
      setTotalSteps(files.length + shellCommands.length);
      setIsProcessing(false);
      
      // Simulate progress
      simulateProgress(files.length + shellCommands.length);
      
      // Auto-select first file if available
      if (files.length > 0) {
        setSelectedFile(files[0]);
      }
    } catch (error) {
      console.error('Error parsing steps:', error);
      setIsProcessing(false);
    }
  };

  const simulateProgress = (total: number) => {
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setCurrentStep(current);
      
      if (current >= total) {
        clearInterval(interval);
      }
    }, 500);
  };

  return (
    <div className="flex h-[99%] bg-black">
      <div className="w-1/7 p-4 border-r border-gray-800">
        <div className="text-xl font-bold mb-4">
          <PromptStatus prompt={prompt || "Failed to load Prompt"} />
        </div>
      </div>

      <div className="w-1/8 p-1 border-r border-gray-800">
        <div className="text-lg text-gray-700">
          <FileStructure files={parsedFiles} onFileSelect={setSelectedFile} />
        </div>
      </div>
      
      <div className="flex-1 p-4 flex flex-col">
        <div className="mb-4">
          <div className="flex space-x-2">
            {/* Preview Button */}
            <button 
              className={`group relative px-4 py-2 rounded-lg font-medium text-xs transition-all duration-300 overflow-hidden ${
                selectedComponent === "Preview" 
                  ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/25" 
                  : "bg-black/60 border border-gray-700/70 text-gray-300 hover:border-gray-600/80 hover:bg-gray-900/60"
              }`}
              onClick={() => setSelectedComponent("Preview")}
            >
              {selectedComponent === "Preview" && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 animate-pulse" />
              )}
              <div className="relative flex items-center space-x-1.5">
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  selectedComponent === "Preview" 
                    ? "bg-blue-400 shadow-lg shadow-blue-400/50" 
                    : "bg-gray-500 group-hover:bg-gray-400"
                }`} />
                <span className="font-['Space_Grotesk'] tracking-wide">Preview</span>
              </div>
              {selectedComponent === "Preview" && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-blue-600/30 rounded-lg blur opacity-30 -z-10" />
              )}
            </button>

            {/* Code Button */}
            <button 
              className={`group relative px-4 py-2 rounded-lg font-medium text-xs transition-all duration-300 overflow-hidden ${
                selectedComponent === "CodeComponent" 
                  ? "bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/25" 
                  : "bg-black/60 border border-gray-700/70 text-gray-300 hover:border-gray-600/80 hover:bg-gray-900/60"
              }`}
              onClick={() => setSelectedComponent("CodeComponent")}
            >
              {selectedComponent === "CodeComponent" && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-cyan-600/10 to-emerald-600/10 animate-pulse" />
              )}
              <div className="relative flex items-center space-x-1.5">
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  selectedComponent === "CodeComponent" 
                    ? "bg-emerald-400 shadow-lg shadow-emerald-400/50" 
                    : "bg-gray-500 group-hover:bg-gray-400"
                }`} />
                <span className="font-['Space_Grotesk'] tracking-wide">Code</span>
              </div>
              {selectedComponent === "CodeComponent" && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600/30 via-cyan-600/30 to-emerald-600/30 rounded-lg blur opacity-30 -z-10" />
              )}
            </button>

            {/* Refresh Button - Only visible when Preview is selected */}
            {selectedComponent === "Preview" && (
              <button 
                className="group relative px-3 py-2 rounded-lg font-medium text-xs transition-all duration-300 overflow-hidden
                         bg-black/60 border border-gray-700/70 text-gray-300 hover:border-orange-500/60 hover:bg-orange-900/20 hover:text-orange-300"
                onClick={() => previewRef.current?.refreshPreview()}
              >
                <div className="relative flex items-center space-x-1.5">
                  <svg className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="font-['Space_Grotesk'] tracking-wide">Refresh</span>
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex-1 bg-black rounded-lg shadow-md">
          {selectedComponent === "Preview" ? 
            <Preview ref={previewRef} parsedFiles={parsedFiles} isProcessing={isProcessing} /> : 
            <CodeComponent selectedFile={selectedFile} />
          }
        </div>
      </div>
    </div>
  );
}

export default MagicScreen;