/**
 * @file selection.js
 * 
 * Este arquivo contém o objeto que representa um estado de uma State Machine e as funções que reagem a eventos lançados quando a máquina está nesse estado.
 * 
 * O estado de seleção possibilita que o usuário selecione, arraste e dimensione figuras.
 * 
 * Toda reação *nunca* muda o estado, realizando uma auto transição interna.
 */

import CanvasDetails from "../../types/CanvasDetails";
import Entity from "../../types/Entity";

import { assign } from "xstate";
import Attribute from "../../types/Attribute";
import Cardinality from '../../types/Cardinality';
import Connection from "../../types/Connection";
import Generalization, { GeneralizationType } from "../../types/Generalization";
import Relation from "../../types/Relation";
import GeralMachineEvents from "../MachineEvents";
import MachineEvents from "./MachineEvents";

const RESIZE_MIN_SIZE = 20;

export const SelectionTypes = Object.freeze({
  entity: 'entity',
  attribute: 'attribute',
  relation: 'relation',
  generalization: 'generalization',
});

export function getSelectionTarget(state, store)
{
  if (!state.matches('conceptual.selection'))
  {
    return null;
  }

  const selections = state.context.payload.selections;

  if (selections.length !== 1)
  {
    return null;
  }

  const id = selections[0].id;
  const type = selections[0].type;

  let target;
  switch(type)
  {
    case SelectionTypes.entity: {
      target = store.conceptual.entities.find(entity => entity.id === id);
      break;
    } 
    case SelectionTypes.attribute:{
      target = store.conceptual.attributes.find(attribute => attribute.id === id);
      break;
    } 
    case SelectionTypes.relation:{
      target = store.conceptual.relations.find(relation => relation.id === id);
      break;
    } 
    case SelectionTypes.generalization:{
      target = store.conceptual.generalizations.find(generalization => generalization.id === id);;
      break;
    } 
    default: throw Error(`Unknown type ${type}`);
  }

  return {target, type: selections[0].type};
}

const selectionEntry = assign({
  payload: {
    drag: true,
    selections: []
  }
})

const selectionExit = assign({
  payload: {}
})

const selectionKeyboardClick = (context, {payload}) => {
  console.log('selectionKeyboardClick');
}

const selectionHandleStageClick = assign({
  payload: (context, {payload}) => {
    if (payload.target === payload.stage)
    {
      return {
        ...context.payload, 
        selections: []
      }
    }
    else
    {
      return context.payload;
    }
  }
})

const selectionHandleClear = assign({
  payload: (context, {payload}) => {
    return {
      ...context.payload, 
      selections: [ ]
    }
  }
});

const selectionHandleEntitySelection = assign({
  payload: (context, {payload}) => {

    const entity = payload.entity;

    if (context.payload.selections.find(selection => selection.id === entity.id))
    {
      return context.payload;
    }

    const data = {
      type: SelectionTypes.entity,
      id: entity.id, 
    };

    if (payload.modifiers.ctrl)
    {
      return {
        ...context.payload, 
        selections: [...context.payload.selections, data ]
      }
    }

    return {
      ...context.payload, 
      selections: [ data ]
    }
  }
})

const selectionHandleEntityDoubleClick = assign({
  payload: (context, {payload}) => {

    const entity = payload.entity;

    const data = {
      type: SelectionTypes.entity,
      id: entity.id, 
    };

    return {
      ...context.payload, 
      selections: [ data ]
    }
  }
});

const selectionHandleEntityMove = (context, {payload}) => {
  const entity = payload.entity;

  Entity.setPosition(entity, payload.position);
  Connection.updateConnections(payload.connections, entity);
}

const selectionHandleEntityResize = (context, {payload}) => {
  const dimension = payload.dimension;

  if (dimension.mainSize < RESIZE_MIN_SIZE)
  {
    dimension.mainSize = RESIZE_MIN_SIZE;
  }

  if (dimension.crossSize < RESIZE_MIN_SIZE)
  {
    dimension.crossSize = RESIZE_MIN_SIZE;
  }

  const entity = payload.entity;

  CanvasDetails.setSize(entity.canvas, payload.dimension);
  Connection.updateConnections(payload.connections, entity);
}

const selectionHandleCardinalityMove = (context, {payload}) => {
  const cardinality = payload.cardinality;

  Cardinality.setPosition(cardinality, payload.position);
}

const selectionHandleAttributeSelection = assign({
  payload: (context, {payload}) => {

    const attribute = payload.attribute;

    if (context.payload.selections.find(selection => selection.id === attribute.id))
    {
      return context.payload;
    }

    const data = {
      type: SelectionTypes.attribute,
      id: attribute.id, 
    };

    if (payload.modifiers.ctrl)
    {
      return {
        ...context.payload, 
        selections: [...context.payload.selections, data ]
      }
    }

    return {
      ...context.payload, 
      selections: [ data ]
    }
  }
})

const selectionHandleAttributeDoubleClick = assign({
  payload: (context, {payload}) => {

    const data = {
      type: SelectionTypes.attribute,
      id: payload.attribute.id, 
    };

    return {
      ...context.payload, 
      selections: [ data ]
    }
  }
});

const selectionHandleAttributeMove = (context, {payload}) => {
  const attribute = payload.attribute;

  Attribute.setPosition(attribute, payload.position);

  Connection.updateConnections(payload.connections, attribute);
}

const selectionHandleAttributeResize = (context, {payload}) => {
  const dimension = payload.dimension;

  if (dimension.mainSize < RESIZE_MIN_SIZE)
  {
    dimension.mainSize = RESIZE_MIN_SIZE;
  }

  if (dimension.crossSize < RESIZE_MIN_SIZE)
  {
    dimension.crossSize = RESIZE_MIN_SIZE;
  }

  const attribute = payload.attribute;
  CanvasDetails.setSize(attribute.canvas, payload.dimension);

  Connection.updateConnections(payload.connections, attribute);
}

const selectionHandleRelationSelection = assign({
  payload: (context, {payload}) => {
    const relation = payload.relation;

    if (context.payload.selections.find(selection => selection.id === relation.id))
    {
      return context.payload;
    }


    const data = {
      type: SelectionTypes.relation,
      id: relation.id, 
    };

    if (payload.modifiers.ctrl)
    {
      return {
        ...context.payload, 
        selections: [...context.payload.selections, data ]
      }
    }

    return {
      ...context.payload, 
      selections: [ data ]
    }
  }
})

const selectionHandleRelationDoubleClick = assign({
  payload: (context, {payload}) => {

    const data = {
      type: SelectionTypes.relation,
      id: payload.relation.id, 
    };

    return {
      ...context.payload, 
      selections: [ data ]
    }
  }
});

const selectionHandleRelationMove = (context, {payload}) => {
  const relation = payload.relation;

  Relation.setPosition(relation, payload.position);

  Connection.updateConnections(payload.connections, relation);
}

const selectionHandleRelationResize = (context, {payload}) => {
  const dimension = payload.dimension;

  if (dimension.mainSize < RESIZE_MIN_SIZE)
  {
    dimension.mainSize = RESIZE_MIN_SIZE;
  }

  if (dimension.crossSize < RESIZE_MIN_SIZE)
  {
    dimension.crossSize = RESIZE_MIN_SIZE;
  }

  const relation = payload.relation;

  CanvasDetails.setSize(payload.relation.canvas, payload.dimension);
  Connection.updateConnections(payload.connections, relation);
}

const selectionHandleGeneralizationSelection = assign({
  payload: (context, {payload}) => {
    const generalization = payload.generalization;

    if (context.payload.selections.find(selection => selection.id === generalization.id))
    {
      return context.payload;
    }


    const data = {
      type: SelectionTypes.generalization,
      id: generalization.id, 
    };

    if (payload.modifiers.ctrl)
    {
      return {
        ...context.payload, 
        selections: [...context.payload.selections, data ]
      }
    }

    return {
      ...context.payload, 
      selections: [ data ]
    }
  }
})

const selectionHandleGeneralizationDoubleClick = assign({
  payload: (context, {payload}) => {

    const data = {
      type: SelectionTypes.generalization,
      id: payload.generalization.id, 
    };

    return {
      ...context.payload, 
      selections: [ data ]
    }
  }
});

const selectionHandleGeneralizationMove = (context, {payload}) => {
  const generalization = payload.generalization;

  Generalization.setPosition(generalization, payload.position);

  Connection.updateConnections(payload.connections, generalization);
}

const selectionHandleGeneralizationTypeMove = (context, {payload}) => {
  const genType = payload.genType;

  GeneralizationType.setPosition(genType, payload.position);
}

const selectionHandleGeneralizationResize = (context, {payload}) => {
  const dimension = payload.dimension;

  if (dimension.mainSize < RESIZE_MIN_SIZE)
  {
    dimension.mainSize = RESIZE_MIN_SIZE;
  }

  if (dimension.crossSize < RESIZE_MIN_SIZE)
  {
    dimension.crossSize = RESIZE_MIN_SIZE;
  }

  const generalization = payload.generalization;

  CanvasDetails.setSize(payload.generalization.canvas, payload.dimension);
  Connection.updateConnections(payload.connections, generalization);
}

const selectionHandleSegmentStartMove = (context, {payload}) => {
  const connection = payload.connection;
  const position = payload.position;
  const boundingBox = payload.boundingBox;

  Connection.updateStartByPosition(connection, position, boundingBox);
}

const selectionHandleSegmentEndMove = (context, {payload}) => {

  const connection = payload.connection;
  const position = payload.position;
  const boundingBox = payload.boundingBox;

  Connection.updateEndByPosition(connection, position, boundingBox);
}

export default Object.freeze({
  entry: selectionEntry,
  exit: selectionExit,
  on: {
    [MachineEvents.STAGE_CLICK]: {
      internal: true,
      actions: selectionHandleStageClick
    },
    [MachineEvents.KEYBOARD_CLICK]: {
      internal: true,
      actions: selectionKeyboardClick
    },
    [MachineEvents.ENTITY_SELECT]: {
      internal: true,
      actions: selectionHandleEntitySelection
    },
    [MachineEvents.ENTITY_DOUBLE_CLICK]: {
      internal: true,
      actions: selectionHandleEntityDoubleClick
    },
    [MachineEvents.ENTITY_MOVE]: {
      internal: true,
      actions: selectionHandleEntityMove
    },
    [MachineEvents.ENTITY_RESIZE]: {
      internal: true,
      actions: selectionHandleEntityResize
    },
    [MachineEvents.ATTRIBUTE_SELECT]: {
      internal: true,
      actions: selectionHandleAttributeSelection
    },
    [MachineEvents.ATTRIBUTE_DOUBLE_CLICK]: {
      internal: true,
      actions: selectionHandleAttributeSelection
    },
    [MachineEvents.ATTRIBUTE_MOVE]: {
      internal: true,
      actions: selectionHandleAttributeMove
    },
    [MachineEvents.ATTRIBUTE_RESIZE]: {
      internal: true,
      actions: selectionHandleAttributeResize
    },
        [MachineEvents.ATTRIBUTE_SELECT]: {
      internal: true,
      actions: selectionHandleAttributeSelection
    },
    [MachineEvents.ATTRIBUTE_DOUBLE_CLICK]: {
      internal: true,
      actions: selectionHandleAttributeDoubleClick
    },
    [MachineEvents.ATTRIBUTE_MOVE]: {
      internal: true,
      actions: selectionHandleAttributeMove
    },
    [MachineEvents.ATTRIBUTE_RESIZE]: {
      internal: true,
      actions: selectionHandleAttributeResize
    },
    [MachineEvents.RELATION_SELECT]: {
      internal: true,
      actions: selectionHandleRelationSelection
    },
    [MachineEvents.RELATION_DOUBLE_CLICK]: {
      internal: true,
      actions: selectionHandleRelationDoubleClick
    },
    [MachineEvents.RELATION_MOVE]: {
      internal: true,
      actions: selectionHandleRelationMove
    },
    [MachineEvents.RELATION_RESIZE]: {
      internal: true,
      actions: selectionHandleRelationResize
    },
    [MachineEvents.GENERALIZATION_SELECT]: {
      internal: true,
      actions: selectionHandleGeneralizationSelection
    },
    [MachineEvents.GENERALIZATION_DOUBLE_CLICK]: {
      internal: true,
      actions: selectionHandleGeneralizationDoubleClick
    },
    [MachineEvents.GENERALIZATION_MOVE]: {
      internal: true,
      actions: selectionHandleGeneralizationMove
    },
    [MachineEvents.GENERALIZATION_RESIZE]: {
      internal: true,
      actions: selectionHandleGeneralizationResize
    },
    [MachineEvents.GENERALIZATION_TYPE_MOVE]: {
      internal: true,
      actions: selectionHandleGeneralizationTypeMove
    },
    [MachineEvents.SEGMENT_START_MOVE]: {
      internal: true,
      actions: selectionHandleSegmentStartMove
    },
    [MachineEvents.SEGMENT_END_MOVE]: {
      internal: true,
      actions: selectionHandleSegmentEndMove,
    },
    [MachineEvents.CONCEPTUAL_CARDINALITY_MOVE]: {
      internal: true,
      actions: selectionHandleCardinalityMove,
    },
    [GeralMachineEvents.CLEAR]: {
      internal: true,
      actions: selectionHandleClear,
    }
  }
});


