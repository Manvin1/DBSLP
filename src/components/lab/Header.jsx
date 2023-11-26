import React from 'react';

import { Divider, Flex, IconButton, useDisclosure, useToast } from '@chakra-ui/react';

import { useDBMSContext } from '../../contexts/DBMSContext';
import { useLabContext } from '../../contexts/LabContext';
import { HEADER_STATES } from '../../reducers/HeaderReducer';
import { DoubleArrowBottomIcon, DoubleArrowTopIcon, PlayIcon, TableIcon } from '../utils/Icons';
import NormalizationModal from './NormalizationModal';

const CLEAR_HISTORY_COUNT = 30;

function Header() {
  const { 
    headerState, 
    dispatchHeaderStateAction, 
    history, setHistory,
    code,
  } = useLabContext();
  const {dbServices} = useDBMSContext();

  const { isOpen: isNormalizationModalOpen, onOpen: onNormalizationModalOpen, onClose: onNormalizationModalClose } = useDisclosure();
  const toast = useToast()

  /**
   * Executar os Statements representes em {@link code}. Cada invocação injeta os statements atuais no histórico.
   */
  function handleSQLStatements()
  {
    if (!dbServices.isDBMSRunning)
    {
      toast({
        title: 'Confira se o banco de dados está em execução.',
        description: `Não foi possível executar o código '${code}' pois o banco de dados não está em execução.`,
        position: 'top',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      return;
    }

    const dbms = dbServices.dbms;
    const time = new Date();

    try
    {
      const results = dbms.exec(code);
    
      if (results.length)
      {
        const resultArr = [];
        results.forEach(result => {
          resultArr.push({type:'table',time, result});
        })
  
        if (history.length + resultArr.length > CLEAR_HISTORY_COUNT)
        {
          setHistory(resultArr);
        }
        else
        {
          setHistory(history.concat(resultArr));
        }
      }

      toast({
        title: 'As Instruções foram executadas com sucesso.',
        description: code,
        position: 'top',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

    }
    catch(e)
    {
      const result = e.message;
      const object = {type:'error', time, result};

      if (history.length > CLEAR_HISTORY_COUNT)
      {
        setHistory([object]);
      }
      else
      {
        setHistory(history.concat({type:'error', time, result}));
      }

      toast({
        title: 'Ocorreu um erro na execução das instruções.',
        description: code,
        position: 'top',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }

  return (
    headerState === HEADER_STATES.closed ? (
      <IconButton
        borderRadius='8px'
        inset='0 0 auto auto'
        zIndex='3'
        position='absolute'
        bgColor='transparent'
        color='openMenu'
        _hover={{
          opacity: '1',
          bgColor: 'openMenuHover'
        }}
        _active={{
          transform: 'scale(.8)',
          color: 'openMenuHover',
          bgColor: 'openMenu'
        }}
        onClick={() => {
          dispatchHeaderStateAction({
            type: 'TOGGLE'
          })
        }}>
        <DoubleArrowBottomIcon boxSize='30px' />
      </IconButton>
    ) : (
      <Flex
        flexDir='column'
        bg='primary'
        color='primaryText'
        fontSize='1.6rem'
        fontFamily='secondary'>

        <Flex
          alignItems='center'
          padding='.5rem'
          gap='1em'>
          <Flex
            alignItems='center'
            gap='1em'>
            <IconButton
              bgColor='transparent'
              color='creation'
              onClick={handleSQLStatements}>
              <PlayIcon width='4em' height='2em'/>
            </IconButton>
          </Flex>

          <Divider
            orientation='vertical' />

          <IconButton
            bgColor='transparent'
            color='primaryText'
            onClick={onNormalizationModalOpen }>
            <TableIcon width='4em' height='2em'/>
          </IconButton>

          <IconButton
            marginLeft='auto'
            bgColor='transparent'
            color='closeMenu'
            bg='transparent'
            _hover={{
              opacity: '1',
              bgColor: 'closeMenuHover'
            }}
            _active={{
              transform: 'scale(.8)',
              color: 'closeMenuHover',
              bgColor: 'closeMenu'
            }}
            onClick={() => {
              dispatchHeaderStateAction({
                type: 'TOGGLE'
              })
            }}>
            <DoubleArrowTopIcon boxSize='30px' />
          </IconButton>
        </Flex>

      <NormalizationModal
        isOpen={isNormalizationModalOpen}
        onOpen={onNormalizationModalOpen}
        onClose={onNormalizationModalClose}
      />
      </Flex>
    )
  )
}

export default Header