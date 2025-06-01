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
  const { steps, basefiles, prompt } = location.state || {};
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
      <div className="w-1/7 p-4 border-r border-gray-300">
        <div className="text-xl font-bold mb-4">
          <PromptStatus prompt={prompt || "Failed to load Prompt"} />
        </div>
      </div>

      <div className="w-1/8 p-4 border-r border-gray-300">
        <div className="text-lg text-gray-700">
          <FileStructure files={parsedFiles} onFileSelect={setSelectedFile} />
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
            {selectedComponent === "Preview" && (
              <button 
                className="relative inline-flex h-10 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 border border-gray-600"
                onClick={() => previewRef.current?.refreshPreview()}
              >
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white backdrop-blur-3xl">
                  Refresh
                </span>
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