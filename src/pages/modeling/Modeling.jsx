import React from 'react'

import { Flex } from '@chakra-ui/react'

import Header from '../../components/modeling/Header';
import Body from '../../components/modeling/Body';
import ModelingContextProvider from '../../contexts/ModelingContext';

/**
 * Componente que representa uma aplicação para Modelagem Conceitual e Lógica de Banco de Dados Relacionais.
 */
function Modeling() {
  return (
    <ModelingContextProvider>
      <Flex
        flex='1'
        flexDir='column'
        overflow='hidden'
        position='relative'>
        <Header/>
        <Body/>
      </Flex>
    </ModelingContextProvider>
  )
}

export default Modeling