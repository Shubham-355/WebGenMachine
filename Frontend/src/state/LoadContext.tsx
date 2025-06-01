import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface LoadContextType {
  isLoaded: boolean;
  setIsLoaded: (value: boolean) => void;
  currentStep: number;
  setCurrentStep: (value: number) => void;
  totalSteps: number;
  setTotalSteps: (value: number) => void;
}

// Create the context with a default undefined
const LoadContext = createContext<LoadContextType | undefined>(undefined);

// Define provider props
interface LoadProviderProps {
  children: ReactNode;
}

// Provider component
export const LoadProvider: React.FC<LoadProviderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  return (
    <LoadContext.Provider value={{ 
      isLoaded, 
      setIsLoaded, 
      currentStep, 
      setCurrentStep, 
      totalSteps, 
      setTotalSteps 
    }}>
      {children}
    </LoadContext.Provider>
  );
};

// Custom hook to use the context
export const useLoad = (): LoadContextType => {
  const context = useContext(LoadContext);
  if (context === undefined) {
    throw new Error('useLoad must be used within a LoadProvider');
  }
  return context;
};