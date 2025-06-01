import { useLoad } from '../state/LoadContext';

const PromptStatus = ({ prompt, projectOverview }: { prompt: string, projectOverview?: string }) => {
  const { currentStep, totalSteps, isLoaded } = useLoad();
  
  // Define the processing steps that match what's happening in preview
  const processingSteps = [
    { id: 1, name: "Analyzing Requirements", description: "Processing your request" },
    { id: 2, name: "Generating Project Structure", description: "Creating file architecture" },
    { id: 3, name: "Writing Components", description: "Building React components" },
    { id: 4, name: "Styling Application", description: "Applying CSS and design" },
    { id: 5, name: "Final Assembly", description: "Putting everything together" }
  ];

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'current':
        return '⟳';
      default:
        return '○';
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'current':
        return 'text-blue-400';
      default:
        return 'text-gray-500';
    }
  };
  
  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Project Overview - Compact */}
      <div className="flex-shrink-0">
       
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-1 border border-gray-600">
          <div className="flex-1 min-w-0">
            <p className="text-gray-200 text-sm leading-tight font-medium line-clamp-2">
                {projectOverview || "Generating a comprehensive web application based on your requirements."}
            </p>
            </div>
        </div>
      </div>
      
      {/* Generation Progress - Flexible */}
      <div className="flex-1 min-h-0 flex flex-col">
        <h3 className="text-xs font-medium text-gray-400 mb-2 flex-shrink-0">Generation Progress</h3>
        <div className="space-y-2 flex-1 overflow-y-auto">
          {processingSteps.map((step) => {
            const status = getStepStatus(step.id);
            return (
              <div key={step.id} className="flex items-center space-x-2">
                <div className={`flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                  status === 'completed' 
                    ? 'bg-green-400 border-green-400 text-gray-900' 
                    : status === 'current'
                    ? 'border-blue-400 text-blue-400 bg-gray-800'
                    : 'border-gray-600 text-gray-600 bg-gray-800'
                }`}>
                  {getStepIcon(status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-medium ${getStepColor(status)} truncate`}>
                    {step.name}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Progress Bar - Compact */}
        <div className="mt-3 pt-2 border-t border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500">Progress:</span>
            <span className="text-gray-300">{currentStep}/{totalSteps}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isLoaded ? 'bg-green-400' : 'bg-blue-400'
              }`}
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[10px] mt-1">
            <span className="text-gray-500">Status:</span>
            <span className={`font-medium ${isLoaded ? 'text-green-400' : 'text-blue-400'}`}>
              {isLoaded ? '✓ Complete' : '⟳ Processing'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromptStatus;