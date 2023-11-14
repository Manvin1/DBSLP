import { createContext, useContext, useState } from "react";

import useHeaderReducer from "../reducers/HeaderReducer";

const LabContext = createContext();

/**
 * Componente que representa o contexto do Laboratório/Workbench.
 */
export default function LabContextProvider({children}) {
  const [headerState, dispatchHeaderStateAction] = useHeaderReducer();
  const [code, setCode] = useState('');
  const [history, setHistory] = useState([]);

  return (
    <LabContext.Provider
      value={{
        code, setCode,
        history, setHistory,
        headerState, dispatchHeaderStateAction,
      }}>
      {children}
    </LabContext.Provider>
  );
}

/**
 * Hook para acessar o {@link LabContext}
 */
export function useLabContext()
{
  const context = useContext(LabContext);

  if (!context)
  {
    throw Error('An LabContext is expected.');
  }

  return context;
}
