import { useLoad } from '../state/LoadContext';

const PromptStatus = ({ prompt, projectOverview }: { prompt: string, projectOverview?: string }) => {
  const { currentStep, totalSteps, isLoaded } = useLoad();
  
  // Define the processing steps that match what's happening in preview
  const processingSteps = [
    { id: 1, name: "Analyzing Requirements", icon: "🔍" },
    { id: 2, name: "Generating Project Structure", icon: "🏗️" },
    { id: 3, name: "Writing Components", icon: "⚛️" },
    { id: 4, name: "Styling Application", icon: "🎨" },
    { id: 5, name: "Final Assembly", icon: "🔧" }
  ];

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400';
      case 'current':
        return 'text-blue-400';
      default:
        return 'text-gray-500';
    }
  };
  
  return (
    <div className="space-y-3 h-full flex flex-col font-['Inter'] text-xs">
      {/* Project Overview - Redesigned */}
      <div className="flex-shrink-0">
        <div className="relative group">
          {/* Subtle border glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-lg blur opacity-60 group-hover:opacity-80 transition duration-300"></div>
          
          {/* Main content container */}
          <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg p-2 hover:border-gray-600/60 transition-all duration-300">
            {/* Header with icon */}
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider font-['JetBrains_Mono']">
                Active Prompt
              </span>
            </div>
            
            {/* Prompt text */}
            <div className="relative">
              <p className="text-gray-100 text-xs leading-tight font-medium tracking-wide line-clamp-2 pr-2">
                {prompt || "No prompt provided"}
              </p>
              
              {/* Subtle fade overlay for long text */}
              <div className="absolute bottom-0 right-0 w-6 h-4 bg-gradient-to-l from-gray-900/80 to-transparent pointer-events-none"></div>
            </div>
            
            {/* Bottom accent line */}
            <div className="mt-2 pt-2 border-t border-gray-800/60">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-gray-500 font-['JetBrains_Mono'] tracking-wider">
                  PROCESSING
                </span>
                <div className="flex space-x-0.5">
                  <div className="w-0.5 h-0.5 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="w-0.5 h-0.5 bg-blue-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-0.5 h-0.5 bg-blue-400 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Generation Progress - Redesigned */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="relative group mb-3">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600/15 via-blue-600/15 to-purple-600/15 rounded-lg blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
          
          <div className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-700/40 rounded-lg p-2">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></div>
              <h3 className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider font-['JetBrains_Mono']">
                Generation Progress
              </h3>
            </div>
            
            {/* Progress overview */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-gray-400">Step {currentStep} of {totalSteps}</span>
              <span className={`text-[10px] font-medium ${isLoaded ? 'text-emerald-400' : 'text-blue-400'}`}>
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            
            {/* Enhanced progress bar */}
            <div className="w-full bg-gray-800/60 rounded-full h-1.5 mb-1 overflow-hidden">
              <div 
                className={`h-1.5 rounded-full transition-all duration-500 ease-out relative ${
                  isLoaded ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-blue-400 to-blue-500'
                }`}
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Steps list */}
        <div className="space-y-2 flex-1">
          {processingSteps.map((step, index) => {
            const status = getStepStatus(step.id);
            return (
              <div key={step.id} className="relative group">
                <div className={`absolute -inset-0.5 rounded-lg blur opacity-0 transition duration-300 ${
                  status === 'current' ? 'bg-blue-600/20 opacity-60' : 
                  status === 'completed' ? 'bg-emerald-600/20 group-hover:opacity-40' : ''
                }`}></div>
                
                <div className={`relative bg-gray-900/40 backdrop-blur-sm border rounded-lg p-2 transition-all duration-300 ${
                  status === 'completed' 
                    ? 'border-emerald-600/30 hover:border-emerald-600/50' 
                    : status === 'current'
                    ? 'border-blue-600/50 shadow-lg shadow-blue-600/10'
                    : 'border-gray-700/30 hover:border-gray-600/40'
                }`}>
                  <div className="flex items-center space-x-2">
                    {/* Step indicator */}
                    <div className={`flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center text-[8px] font-bold transition-all duration-300 ${
                      status === 'completed' 
                        ? 'bg-emerald-400 border-emerald-400 text-gray-900 shadow-lg shadow-emerald-400/30' 
                        : status === 'current'
                        ? 'border-blue-400 text-blue-400 bg-gray-800 shadow-lg shadow-blue-400/20 animate-pulse'
                        : 'border-gray-600/60 text-gray-600 bg-gray-800/50'
                    }`}>
                      {status === 'completed' ? '✓' : status === 'current' ? step.icon : step.id}
                    </div>
                    
                    {/* Step content */}
                    <div className="flex-1 min-w-0">
                      <div className={`text-[10px] font-semibold transition-colors duration-300 ${getStepColor(status)}`}>
                        {step.name}
                      </div>
                      
                      {/* Current step indicator */}
                      {status === 'current' && (
                        <div className="mt-1 flex items-center space-x-1">
                          <div className="flex space-x-0.5">
                            <div className="w-0.5 h-0.5 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-0.5 h-0.5 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-0.5 h-0.5 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                          </div>
                          <span className="text-[8px] text-blue-400 font-medium font-['JetBrains_Mono'] tracking-wider">
                            IN PROGRESS
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Status footer */}
        <div className="mt-2 pt-2 border-t border-gray-700/40 flex-shrink-0">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600/10 via-gray-500/10 to-gray-600/10 rounded-lg blur opacity-40"></div>
            
            <div className="relative bg-gray-900/40 backdrop-blur-sm border border-gray-700/30 rounded-lg p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <span className="text-[9px] text-gray-500 font-['JetBrains_Mono'] tracking-wider">
                    STATUS
                  </span>
                  <div className={`w-1 h-1 rounded-full ${isLoaded ? 'bg-emerald-400' : 'bg-blue-400 animate-pulse'}`}></div>
                </div>
                <span className={`font-semibold text-[10px] ${isLoaded ? 'text-emerald-400' : 'text-blue-400'}`}>
                  {isLoaded ? '✓ Complete' : '⟳ Generating...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromptStatus;