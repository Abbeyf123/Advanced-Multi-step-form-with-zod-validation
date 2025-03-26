import { FormControlContext , FormControlContextProps} from "@/FormContextProvider";
import { useContext } from "react";
export const useFormContextValues = ():FormControlContextProps => {
  const context = useContext(FormControlContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormControlContextProvider');
  }
  return context;
}