import { createContext, useContext, useEffect, useState } from "react";
import useHeaderReducer from "../reducers/HeaderReducer";
import useRDBMS from "../hooks/useRDBMS";

const DBMSContext = createContext();

/**
 * Componente que representa o contexto do Database Management System.
 */
export default function DBMSContextProvider({children}) {
  const dbServices = useRDBMS();

  return (
    <DBMSContext.Provider
      value={{
        dbServices
      }}>
      {children}
    </DBMSContext.Provider>
  );
}

/**
 * Hook para acessar o {@link DBMSContext}.
 */
export function useDBMSContext()
{
  const context = useContext(DBMSContext);

  if (!context)
  {
    throw Error('An DBMSContext is expected.');
  }

  return context;
}
