import React from 'react';

import { Divider, Flex } from '@chakra-ui/react';
import { useActor } from '@xstate/react';

import { useModelingContext } from '../../contexts/ModelingContext';
import { useAppContext } from '../../contexts/global/AppContext';
import { DevicesTypes } from '../../hooks/useDeviceInfo';
import { CursorIcon, DiamondIcon, EllipseIcon, RectangleIcon, TriangleIcon } from '../utils/Icons';
import { ICON_SIZE, ToolButton } from './Tools';
import MachineEvents from './state/MachineEvents';

/**
 * Componente que representa as Ferramentas de usuário usadas para manipular o Viewport da Ferramenta de Modelagem Conceitual.
 */
function ConceptualTools() {
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
        gap='1em'>
        <ToolButton
          isSelected={state.matches('conceptual.selection')}
          onClick={() => {
            send(MachineEvents.CONCEPTUAL_SELECTION);
          }}>
          <CursorIcon boxSize={ICON_SIZE} />
        </ToolButton>
      </Flex>

      <Divider
        orientation={
          isDeviceThisType(DevicesTypes.desktop)? 'horizontal' : 'vertical'
        } />

      <Flex
        flexDir={{
          lg: 'column'
        }}
        gap='1em'>
        <ToolButton
          isSelected={state.matches('conceptual.entityInsertion')}
          onClick={() => {
            send(MachineEvents.CONCEPTUAL_ENTITY_INSERTION);
          }}
        >
          <RectangleIcon boxSize={ICON_SIZE} />
        </ToolButton>

        <ToolButton
          isSelected={state.matches('conceptual.relationInsertion')}
          onClick={() => {
            send(MachineEvents.CONCEPTUAL_RELATION_INSERTION);
          }}>
          <DiamondIcon boxSize={ICON_SIZE} />
        </ToolButton>

        <ToolButton
          isSelected={state.matches('conceptual.attributeInsertion')}
          onClick={() => {
            send(MachineEvents.CONCEPTUAL_ATTRIBUTE_INSERTION);
          }}>
          <EllipseIcon boxSize={ICON_SIZE} />
        </ToolButton>

        <ToolButton
          isSelected={state.matches('conceptual.generalizationInsertion')}
          onClick={() => {
            send(MachineEvents.CONCEPTUAL_GENERALIZATION_INSERTION);
          }}>
          <TriangleIcon boxSize={ICON_SIZE} />
        </ToolButton>
      </Flex>

    </Flex>
  )
}

export default ConceptualTools