// src/conetxt/bookContext.tsx
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

// Create a Context with a default value
const MyContext = createContext<
  | { isEditting: boolean; setIsEditting: Dispatch<SetStateAction<boolean>> }
  | undefined
>(undefined);

// Create a Provider component
export const MyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isEditting, setIsEditting] = useState<boolean>(false);

  return (
    <MyContext.Provider value={{ isEditting, setIsEditting }}>
      {children}
    </MyContext.Provider>
  );
};

// Create a custom hook for easier access to the context
export const useBookContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
};
