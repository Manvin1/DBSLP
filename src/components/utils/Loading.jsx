import React from 'react'

import { CircularProgress, Flex, Text } from '@chakra-ui/react'

import { LogoIcon } from './Icons'

/**
 * Componente que representa uma Tela de Loading.
 */
function Loading({msg = 'Carregando...'}) {
  return (
    <Flex
      justifyContent='center'
      alignItems='center'
      w='100%'
      h='100%'
      flexDir='column'
      gap='2em' >
      <LogoIcon
        w='60px'
        h='60px'/>
      <Text
        fontSize='2rem'
        fontWeight='bold'
        >
        {msg}
      </Text>
      <CircularProgress 
        isIndeterminate 
        color='black'
        size='30px' />
    </Flex>
  )
}

export default Loading