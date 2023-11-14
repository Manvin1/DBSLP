import React from 'react';

import { Divider, Flex } from '@chakra-ui/react';
import { useActor } from '@xstate/react';

import { useModelingContext } from '../../contexts/ModelingContext';
import { useAppContext } from '../../contexts/global/AppContext';
import { DevicesTypes } from '../../hooks/useDeviceInfo';
import { CursorIcon, RectangleIcon } from '../utils/Icons';
import { ICON_SIZE, ToolButton } from './Tools';
import MachineEvents from './state/MachineEvents';

/**
 * Componente que representa as Ferramentas de usuário usadas para manipular o Viewport da Ferramenta de Modelagem Lógica.
 */
function LogicalTools() {
  const {
    deviceInfo: {isDeviceThisType}
  } = useAppContext();

  const {
    toolMachineServices,
  } = useModelingContext();
  const [state, send] = useActor(toolMachineServices);

  return (
    <Flex
          order={{
        lg: '-1',
      }}
      flexDir={{
        lg: 'column'
      }}
      bgColor='primary'
      as='section'
      padding='1em'
      color='primaryText'
      gap='1em'>

      <Flex
        flexDir={{
          lg: 'column'
        }}
        gap='1em'>
        <ToolButton
          isSelected={state.matches('logical.selection')}
          onClick={() => {
            send(MachineEvents.LOGICAl_SELECTION);
          }}>
          <CursorIcon boxSize={ICON_SIZE} />
        </ToolButton>
      </Flex>

      <Divider
        orientation={
          isDeviceThisType(DevicesTypes.desktop)? 'horizontal' : 'vertical'
        } />

      <Flex
        gap='1em'>
        <ToolButton
          isSelected={state.matches('logical.tableInsertion')}
          onClick={() => {
            send(MachineEvents.LOGICAl_TABLE_INSERTION);
          }} >
          <RectangleIcon boxSize={ICON_SIZE} />
        </ToolButton>
      </Flex>

    </Flex>
  )
}

export default LogicalTools