import { createContext, useContext, useEffect, useState } from "react";

import { useInterpret } from "@xstate/react";
import { useLocation } from "react-router-dom";

import ModelingStateMachine from "../components/modeling/state/ModelingStateMachine";
import useHeaderReducer from "../reducers/HeaderReducer";
import useModelingPageReducer from "../reducers/modelingPageReducer";

const ModelingContext = createContext();

export const PAGES = [
  {
    id: 0,
    title: 'conceptual',
    path: ['/', '/modelagem'],
  },
  {
    id: 1,
    title: 'logical',
    path: ['/logical'],
  },
];

/**
 * Componente que representa o contexto das Ferramentas de Modelagem.
 */
export default function ModelingContextProvider({children}) {
  const [headerState, dispatchHeaderStateAction] = useHeaderReducer();
  const [currentPage, dispatchCurrentPageAction] = useModelingPageReducer();

  const toolMachineServices = useInterpret(ModelingStateMachine);
  const location = useLocation();

  const [stage, setStage] = useState();

  useEffect(() => {
    const index = location.pathname.lastIndexOf('/');
    let path = location.pathname.slice(index);
    const page = PAGES
      .find(page => page.path.includes(path))
      .title;

    if (currentPage !== page)
    {
      dispatchCurrentPageAction({
        type: 'SET_PAGE',
        payload: {
          target: page
        }
      });
    }
  }, [location]);

  return (
    <ModelingContext.Provider
      value={{
        currentPage,
        stage, setStage,
        headerState, dispatchHeaderStateAction,
        toolMachineServices
      }}>
      {children}
    </ModelingContext.Provider>
  );
}

/**
 * Hook para acessar o {@link ModelingContext}
 */
export function useModelingContext()
{
  const context = useContext(ModelingContext);

  if (!context)
  {
    throw Error('An ModelingContext is expected.');
  }

  return context;
}
