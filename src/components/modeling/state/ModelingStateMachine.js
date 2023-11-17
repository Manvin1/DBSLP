import { assign, createMachine } from 'xstate';

import MachineEvents from './MachineEvents';
import conceptualAttributeInsertion from './conceptual/attributeInsertion';
import conceptualEntityInsertion from './conceptual/entityInsertion';
import conceptualGeneralizationInsertion from './conceptual/generalizationInsertion';
import conceptualRelationInsertion from './conceptual/relationInsertion';
import conceptualSelection from './conceptual/selection';
import logicalSelection from './logical/selection';
import logicalTableInsertion from './logical/tableInsertion';
import Connection from '../types/Connection';

const handleSegmentStartMove = (context, {payload}) => {
  const connection = payload.connection;
  const position = payload.position;
  const boundingBox = payload.boundingBox;

  Connection.updateStartByPosition(connection, position, boundingBox);
}

const handleSegmentEndMove = (context, {payload}) => {

  const connection = payload.connection;
  const position = payload.position;
  const boundingBox = payload.boundingBox;

  Connection.updateEndByPosition(connection, position, boundingBox);
}

const handleClear = assign({
  payload: (context, {payload}) => {
    return {
      ...context.payload, 
      selections: [ ]
    }
  }
});

/**
 * State Machine que gerencia o estado de ferramentas de modelagem conceitual e lógica de banco de dados.
 * 
 * Essa máquina é do tipo paralela, contendo uma região para a modelagem conceitual e outra região para a modelagem lógica. O contexto (extended state) é compartilhado entre as duas regiões.
 */
export default createMachine({
  id: 'modelingToolMachine',
  type: 'parallel',
  context: {
    payload: undefined,
  },
  states: {
    conceptual: {
      initial: 'selection',
      states: {
        selection: conceptualSelection,
        entityInsertion: conceptualEntityInsertion,
        attributeInsertion: conceptualAttributeInsertion,
        relationInsertion: conceptualRelationInsertion,
        generalizationInsertion: conceptualGeneralizationInsertion,
      },
    },
    logical: { 
      initial: 'selection',
      context: {
        payload: undefined,
      },
      states: {
        selection: logicalSelection,
        tableInsertion: logicalTableInsertion,
      },
    },
  },
  on: {
    [MachineEvents.CONCEPTUAL_SELECTION]: 'conceptual.selection',
    [MachineEvents.CONCEPTUAL_ENTITY_INSERTION]: 'conceptual.entityInsertion',
    [MachineEvents.CONCEPTUAL_RELATION_INSERTION]: 'conceptual.relationInsertion',
    [MachineEvents.CONCEPTUAL_ATTRIBUTE_INSERTION]: 'conceptual.attributeInsertion',
    [MachineEvents.CONCEPTUAL_GENERALIZATION_INSERTION]: 'conceptual.generalizationInsertion',
    [MachineEvents.LOGICAl_SELECTION]: 'logical.selection',
    [MachineEvents.LOGICAl_TABLE_INSERTION]: 'logical.tableInsertion',
    [MachineEvents.SEGMENT_START_MOVE]: {
      internal: true,
      actions: handleSegmentStartMove
    },
    [MachineEvents.SEGMENT_END_MOVE]: {
      internal: true,
      actions: handleSegmentEndMove,
    },
    [MachineEvents.CLEAR]: {
      internal: true,
      actions: handleClear,
    },
  }
});

