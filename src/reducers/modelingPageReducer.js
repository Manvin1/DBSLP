import { useReducer } from "react";

const INITIAL_ARG = '';

/**
 * Reducer para gerenciar o ciclo de vida das páginas da aplicação de modelagem.
 * 
 * As ações devem ter o formato {type, payload}.
 */
function modelingPageReducer(state, {type, payload: {target}})
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
 * Hook para acessar o estado do {@link modelingPageReducer}
 */
export function useModelingPageReducer()
{
  return useReducer(modelingPageReducer, INITIAL_ARG);
}

export default useModelingPageReducer;