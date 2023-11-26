import React from 'react';

import { Flex } from '@chakra-ui/react';

import { useDBMSContext } from '../contexts/DBMSContext';
import { useAppContext } from '../contexts/global/AppContext';
import { DatabaseIcon, NetworkIcon, ToolsIcon } from './utils/Icons';

const ICON_SIZE = '20px';

/**
 * Componente que representa a barra de status (rodapé).
 */
function Footer() {
  const {dbServices} = useDBMSContext();
  const {storeServices} = useAppContext();

  return (
    <Flex 
      as='footer'
      borderTop='1px solid black'
      justifyContent='space-between'
      padding='.25em'
      bgColor='primary'
      color='primaryText'
      fontFamily='primary'
      fontSize='1.6rem'>
      <Flex 
        as='section'
        gap='1em'
        alignItems='center'>
        <Flex
          alignItems='center'
          gap='.5em'>
          <DatabaseIcon boxSize={ICON_SIZE} />
          {dbServices.isDBMSRunning? 'Executando' : 'Parado'}
        </Flex>

        <Flex
          alignItems='center'
          gap='.5em'>
          <NetworkIcon boxSize={ICON_SIZE}/>
          {
            storeServices.isConnected? 'Conectado' : 'Desconectado'
          }
        </Flex>
      </Flex>

      <Flex as='section' alignItems='center'
        gap='.5em'>
        <ToolsIcon boxSize={ICON_SIZE}/>
      </Flex>
    </Flex>
  )
}

export default Footer