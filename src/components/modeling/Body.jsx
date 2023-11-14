import React from 'react'

import { Flex } from '@chakra-ui/react'

import ModelingCanvas from './ModelingCanvas'
import Tabs from './Tabs'
import Tools from './Tools'

/**
 * Componente que representa o corpo da ferramenta de modelagem.
 */
function Body() {
  return (
    <Flex
      borderTop='1px solid'
      borderTopColor='secondaryFg'
      as='main'
      flexBasis='0'
      flexGrow='1'
      overflow='hidden'
      flexDir={{
        base: 'column',
        lg: 'row'
      }}>
      <ModelingCanvas/>
      <Tools/>
      <Tabs/>
    </Flex>

  )
}

export default Body