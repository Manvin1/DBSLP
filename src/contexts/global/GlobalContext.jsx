import React from 'react'

import DBMSContextProvider from '../DBMScontext'
import AppContextProvider from './AppContext'
import ThemeProvider from './ThemeProvider'

/**
 * Componente que agrega todos os contextos de alto nível (globais) da aplicação.
 */
function GlobalContext({children}) {
  return (
    <ThemeProvider>
      <AppContextProvider>
        <DBMSContextProvider>
          {children}
        </DBMSContextProvider>
      </AppContextProvider>
    </ThemeProvider>
  )
}

export default GlobalContext