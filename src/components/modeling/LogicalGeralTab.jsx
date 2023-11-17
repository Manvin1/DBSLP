import React, { useEffect, useState } from 'react';

import { Button, Flex, FormLabel, Input, Text } from '@chakra-ui/react';
import { useActor } from '@xstate/react';

import { useModelingContext } from '../../contexts/ModelingContext';
import { useAppContext } from '../../contexts/global/AppContext';
import GeralMachineEvents from './state/MachineEvents';
import MachineEvents from './state/logical/MachineEvents';
import { SelectionTypes, getSelectionTarget } from './state/logical/selection';
import Connection from './types/Connection';

const EMPTY_VALUE = '-';

/**
 * Componente que representa a Tab que gerencia as propriedades gerais das Tabelas do Modelo Relacional.
 */
function LogicalGeralTab() {
  const {
    toolMachineServices
  } = useModelingContext();
  const {store} = useAppContext();

  const [state, send] = useActor(toolMachineServices);
  const [name, setName] = useState(EMPTY_VALUE)
  const selectedTarget = getSelectionTarget(state, send, store);

  useEffect(() => {
    if (!selectedTarget || !selectedTarget.target.name)
    {
      setName(EMPTY_VALUE);
      return;
    }

    setName(selectedTarget.target.name);

  },[selectedTarget]);

  /**
   * Atualizar o nome da Tabela.
   * 
   * @param {Event} e 
   */
  function handleNameChange(e)
  {
    if (!selectedTarget)
    {
      return;
    }

    const target = selectedTarget.target;

    setName(e.target.value);

    switch(selectedTarget.type)
    {
      case SelectionTypes.table: {
        const table = store.logical.tables.find(table => table.id === target.id);

        table.name = e.target.value;
          
        send({
          type: MachineEvents.TABLE_SELECT,
          payload: {
            table,
            modifiers: {}
          }
        })
        break;
      }
      default: {
        throw Error('Unknown type');
      }
    }
  }

  return (
    <Flex 
        gap='.5em'
        alignItems='flex-start'
        flexDir='column'>
        <FormLabel htmlFor='name'>
          Nome
        </FormLabel>
        <Input 
          id='name' 
          onChange={handleNameChange}
          value={name}
          isReadOnly={!Boolean(selectedTarget) || !selectedTarget.target.name}
          type='text'/>

        <Text>
          Posição
        </Text>

        <Flex 
          flexWrap='wrap'
          gap='2em'>
          <Flex 
            flexWrap='wrap'
            gap='1em'
            grow='1'
            alignItems='flex-start'>
            <FormLabel htmlFor='positionX' margin='0'>
              x
            </FormLabel>

            <Input 
              id='positionX' 
              value={selectedTarget? Number(selectedTarget.target.canvas.position.x).toFixed(3) : EMPTY_VALUE}
              isReadOnly={true}
              type='text'/>
          </Flex>

          <Flex 
            flexWrap='wrap'
            gap='1em'
            grow='1'
            alignItems='flex-start'>
            <FormLabel htmlFor='positionY' margin='0'>
              y
            </FormLabel>

            <Input 
              id='positionY'
              value={selectedTarget? Number(selectedTarget.target.canvas.position.y).toFixed(3) : EMPTY_VALUE}
              isReadOnly={true}
              type='text'/>
          </Flex>
        </Flex>
        
        <Text>
          Dimensão
        </Text>

        <Flex 
          flexWrap='wrap'
          gap='2em'>
          <Flex 
            flexWrap='wrap'
            gap='1em'
            grow='1'
            alignItems='flex-start'>
            <FormLabel htmlFor='mainSize' margin='0'>
              Tamanho Principal
            </FormLabel>
            <Input 
              id='mainSize' 
              value={selectedTarget? Number(selectedTarget.target.canvas.dimension.mainSize).toFixed(3) : '-'}
              isReadOnly={true}
              type='text'/>
          </Flex>

          <Flex 
            flexWrap='wrap'
            gap='1em'
            grow='1'
            alignItems='flex-start'>
            <FormLabel htmlFor='crossSize' margin='0'>
              Tamanho secundário
            </FormLabel>
            <Input 
              id='crossSize'
              value={selectedTarget? Number(selectedTarget.target.canvas.dimension.crossSize).toFixed(3) : EMPTY_VALUE}
              isReadOnly={true}
              type='text'/>
          </Flex>
        </Flex>

        <Button
          isDisabled={!selectedTarget}
          onClick={()=> {
            const id = selectedTarget.target.id;

            switch(selectedTarget.type)
            {
              case SelectionTypes.table: {
                const index = store.logical.tables.findIndex(table => table.id === id);
                store.logical.tables.splice(index, 1);
                break;
              }
              default: {
                throw Error('Unknown type');
              }
            }

            Connection.removeConnectionsById(store.logical.connections, id);
            send({
              type: GeralMachineEvents.CLEAR
            })
          }}
          color='secondary'
          bgColor='exclusion'>
          <Text as='span'>Excluir</Text>
        </Button>
    </Flex>
  )
}

export default LogicalGeralTab