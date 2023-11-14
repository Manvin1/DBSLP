import { useReducer } from "react";

export const HEADER_STATES = Object.freeze({
  closed: 'closed',
  open: 'open',
});

const INITIAL_ARG = HEADER_STATES.open;

/**
 * Reducer para gerenciar o ciclo de vida de um cabeçalho.
 * 
 * As ações devem ter o formato {type, payload}.
 */
function headerReducer(state, {type, payload})
{
  switch (type)
  {
    case 'SET_OPENED': {
      return HEADER_STATES.open;
    }
    case 'SET_CLOSED': {
      return HEADER_STATES.closed;
    }
    case 'TOGGLE': {
      return state === HEADER_STATES.open? HEADER_STATES.closed : HEADER_STATES.open;
    }
    default: {
      throw Error(`Unknown ${type} action`);
    }
  }
}

/**
 * Hook para acessar o estado do {@link headerReducer}
 */
export function useHeaderReducer()
{
  return useReducer(headerReducer, INITIAL_ARG);
}

export default useHeaderReducer;