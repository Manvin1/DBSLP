import React from 'react'

import { Flex, Text } from '@chakra-ui/react'

/**
 * Componente que representa a página para dispositivos não suportados por uma aplicação.
 */
function UnsupportedDevice() {
  return (
    <Flex
      h='100vh'
      alignItems='center'
      justifyContent='center'
      textAlign='center'>
      <Text>
        Desculpe, mas o seu dispositivo não é suportado pela aplicação.
      </Text>
    </Flex>
  )
}

export default UnsupportedDevice
