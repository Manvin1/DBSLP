import { useReducer } from "react";

const INITIAL_ARG = '';

/**
 * Reducer para gerenciar o ciclo de vida das páginas da aplicação 'Home'.
 * 
 * As ações devem ter o formato {type, payload}.
 */
function homePageReducer(state, {type, payload: {target}})
{
  switch (type)
  {
    case 'SET_PAGE': {
      return target;
    }
    default: {
      throw Error(`Unknown ${type} action`);
    }
  }
}

/**
 * Hook para acessar o estado do {@link homePageReducer}
 */
export function useHomePageReducer()
{
  return useReducer(homePageReducer, INITIAL_ARG);
}

export default useHomePageReducer;