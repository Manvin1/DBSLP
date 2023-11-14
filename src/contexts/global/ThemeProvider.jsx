import React from 'react'
import theme from "../../../theme";
import { ChakraProvider } from '@chakra-ui/react';

/**
 * Componente que representa o contexto de tema da aplicação.
 */
function ThemeProvider({children}) {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  )
}

export default ThemeProvider