import { createContext, useContext, useEffect } from "react";

import { useLocation } from "react-router-dom";

import notas from '../assets/notas.md?raw';
import sobre from '../assets/sobre.md?raw';
import licencas from '../assets/licencas.md?raw';
import useHomePageReducer from "../reducers/homePageReducer";


export const PAGES = [
  {
    id: 0,
    title: 'Sobre',
    path: '/',
    type:'markdown',
    data: sobre,
    isIndex: true,
  },
  {
    id: 1,
    title: 'Notas da versão',
    path: '/notas',
    type:'markdown',
    data: notas
  },
  {
    id: 2,
    title: 'Licenças',
    path: '/licencas',
    type:'markdown',
    data: licencas
  },
  {
    id: 3,
    title: 'Manual do Usuário',
    path: '/manualUsuario',
    type:'pdf',
    data: '/ManuelDoUsuarioDBSLP.pdf',
    fileName: 'ManuelDoUsuarioDBSLP'
  },
  {
    id: 4,
    title: 'Manual do Desenvolvedor',
    path: '/manualDesenvolvedor',
    type:'pdf',
    data: '/DocumentacaoDBSLP.pdf',
    fileName: 'DBSLP'
  }
];

const HomeContext = createContext();

/**
 * Componente que representa o contexto da aplicação 'Home'.
 */
export default function HomeContextProvider({children}) {
  const [currentPage, dispatchCurrentPageAction] = useHomePageReducer();
  const location = useLocation();

  useEffect(() => {
    const page =  PAGES.find(page => page.path === location.pathname);
    const title = page?.title;

    if (currentPage !== title && title)
    {
      dispatchCurrentPageAction({
        type: 'SET_PAGE',
        payload: {
          target: title
        }
      });
    }
  }, [location]);


  return (
    <HomeContext.Provider
      value={{
        currentPage, dispatchCurrentPageAction
      }}>
      {children}
    </HomeContext.Provider>
  );
}

/**
 * Hook para acessar o {@link HomeContext}.
 */
export function useHomeContext()
{
  const context = useContext(HomeContext);

  if (!context)
  {
    throw Error('An HomeContext is expected.');
  }

  return context;
}
