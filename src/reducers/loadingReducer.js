import { useReducer } from "react";

const INITIAL_ARG = 'loading';

/**
 * Reducer para gerenciar o ciclo de vida de carregamentos.
 * 
 * As ações devem ter o formato {type, payload}.
 */
function loadingReducer(state, {type})
{
  switch (type)
  {
    case 'SET_READY': {
      return 'ready';
    }
    case 'SET_LOADING': {
      return 'loading';
    }
    case 'SET_ERROR': {
      return 'error';
    }
    default: {
      throw Error(`Unknown ${type} action`);
    }
  }
}

/**
 * Hook para acessar o estado do {@link loadingReducer}
 */
export function useLoadingReducer()
{
  return useReducer(loadingReducer, INITIAL_ARG);
}

export default useLoadingReducer;