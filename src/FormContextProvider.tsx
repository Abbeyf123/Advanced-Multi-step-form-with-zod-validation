import { Step } from "@/components/applicationForm/ApplicationForm";
import React, { createContext, useState } from "react";

export interface FormControlContextProps {
  currentPageIndex: number;
  previousPageIndex: number;
  delta: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFinalPage: boolean;
  handleNext: () => void;
  handlePrevious: () => void;
  setCurrentPageIndex: (index: number) => void;
  setPreviousPageIndex: (index: number) => void;
  setPage: (index: number) => void;
}

export const FormControlContext = createContext<FormControlContextProps | undefined>(
  undefined
);

interface FormControlProviderProps {
  children: React.ReactNode;
  steps: Step[];
}
const FormControlProvider: React.FC<FormControlProviderProps> = ({
  children,
  steps,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [previousPageIndex, setPreviousPageIndex] = useState(0);

  const hasNextPage = currentPageIndex < steps.length - 1;
  const hasPreviousPage = currentPageIndex > 0;
  const isFinalPage = currentPageIndex === steps.length - 1;

  const handleNext = () => {
    if(currentPageIndex === steps.length - 1) return
    setCurrentPageIndex(currentPageIndex + 1);
    setPreviousPageIndex(currentPageIndex);
  };

  const handlePrevious = () => {
    if(currentPageIndex === 0) return
    setCurrentPageIndex(currentPageIndex - 1);
    setPreviousPageIndex(currentPageIndex);
  };

  const setPage = (index: number) => {
    if (index === currentPageIndex) return
    if (index > currentPageIndex + 1) return
    setCurrentPageIndex(index);
    setPreviousPageIndex(currentPageIndex)
  };

  const delta = currentPageIndex - previousPageIndex;
  

  return (
    <FormControlContext.Provider
      value={{
        currentPageIndex,
        previousPageIndex,
        delta,
        hasNextPage,
        hasPreviousPage,
        isFinalPage,
        handleNext,
        handlePrevious,
        setCurrentPageIndex,
        setPreviousPageIndex,
        setPage,
      }}
    >
      {children}
    </FormControlContext.Provider>
  );
};

export default FormControlProvider