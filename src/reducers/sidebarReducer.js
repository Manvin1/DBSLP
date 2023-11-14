import { useReducer } from "react";

export const SIDEBAR_STATES = Object.freeze({
  closed: 'closed',
  open_collapsed: 'open_collapsed',
  open_expanded: ' open_expanded',
});

const INITIAL_ARG = SIDEBAR_STATES.open_collapsed;

/**
 * Reducer para gerenciar o ciclo de vida da barra lateral.
 * 
 * As ações devem ter o formato {type, payload}.
 */
function sidebarReducer(state, {type, payload})
{
  switch (type)
  {
    case 'SET_OPENED_COLLAPSED': {
      return SIDEBAR_STATES.open_collapsed;
    }
    case 'SET_CLOSED': {
      return SIDEBAR_STATES.closed;
    }
    case 'TOGGLE_OPENED_COLLAPSED': {
      return state === SIDEBAR_STATES.closed? SIDEBAR_STATES.open_collapsed : SIDEBAR_STATES.closed;
    }
    default: {
      throw Error(`Unknown ${type} action`);
    }
  }
}

/**
 * Hook para acessar o estado do {@link sidebarReducer}
 */
export function useSidebarReducer()
{
  return useReducer(sidebarReducer, INITIAL_ARG);
}

export default useSidebarReducer;