import React from 'react'

import { Flex } from '@chakra-ui/react'

import Body from '../../components/lab/Body'
import Header from '../../components/lab/Header'
import LabContextProvider from '../../contexts/LabContext'

/**
 * Componente que representa a aplicação de laboratório/Workbench para execução de SQL.
 */
function Lab() {
  return (
    <LabContextProvider>
      <Flex
        overflow='hidden'
        flex='1'
        flexDir='column'>
        <Header/>
        <Body/>
      </Flex>
    </LabContextProvider>
  )
}

export default Lab