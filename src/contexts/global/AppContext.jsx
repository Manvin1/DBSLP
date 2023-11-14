import { createContext, useContext } from "react";

import useDeviceInfo from "../../hooks/useDeviceInfo";
import { useSyncModeling } from "../../hooks/useSyncModeling";
import useLoadingReducer from "../../reducers/loadingReducer";
import useSidebarReducer from "../../reducers/sidebarReducer";

const AppContext = createContext();

/**
 * Componente que representa o contexto da aplicação.
 */
export default function AppContextProvider({children}) {
  const deviceInfo = useDeviceInfo();
  const [sidebarState, dispatchSideBarStateAction] = useSidebarReducer();
  const [loadingState, dispatchLoadingStateAction] = useLoadingReducer();
  const storeServices = useSyncModeling();

  return (
    <AppContext.Provider
      value={{
        deviceInfo,
        storeServices,
        store: storeServices.store,
        sidebarState, dispatchSideBarStateAction,
        loadingState, dispatchLoadingStateAction,
      }}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * Hook para acessar o {@link AppContext}.
 */
export function useAppContext()
{
  const context = useContext(AppContext);

  if (!context)
  {
    throw Error('An AppContext is expected.');
  }

  return context;
}
