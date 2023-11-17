/**
 * @file selection.js
 * 
 * Este arquivo contém o objeto que representa um estado de uma State Machine e as funções que reagem a eventos lançados quando a máquina está nesse estado.
 * 
 * O estado de seleção possibilita que o usuário selecione, arraste e dimensione tabelas.
 * 
 * Toda reação *nunca* muda o estado, realizando uma auto transição interna.
 */

import { assign } from "xstate";

import CanvasDetails from "../../types/CanvasDetails";
import Cardinality from "../../types/Cardinality";
import Connection from "../../types/Connection";
import Table from "../../types/Table";
import MachineEvents from "./MachineEvents";
import GeralMachineEvents from '../MachineEvents';

const RESIZE_MIN_SIZE = 20;

export const SelectionTypes = Object.freeze({
  table: 'table',
});

export function getSelectionTarget(state, send, store)
{
  if (!state.matches('logical.selection'))
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
    case SelectionTypes.table: {
      target = store.logical.tables.find(table => table.id === id);
      break;
    } 
    default: throw Error(`Unknown type ${type}`);
  }

  if(!target)
  {
    setTimeout(()=>{
      send({
        type: GeralMachineEvents.CLEAR
      });
    },0);
    
    return null;
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
    console.log('logical clear');
    return {
      ...context.payload, 
      selections: [ ]
    }
  }
});

const selectionHandleTableSelection = assign({
  payload: (context, {payload}) => {

    const table = payload.table;

    if (context.payload.selections.find(selection => selection.id === table.id))
    {
      return context.payload;
    }

    const data = {
      type: SelectionTypes.table,
      id: table.id, 
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

const selectionHandleTableDoubleClick = assign({
  payload: (context, {payload}) => {

    const table = payload.table;

    const data = {
      type: SelectionTypes.table,
      id: table.id, 
    };

    return {
      ...context.payload, 
      selections: [ data ]
    }
  }
});

const selectionHandleTableMove = (context, {payload}) => {
  const table = payload.table;

  Table.setPosition(table, payload.position);
  Connection.updateConnections(payload.connections, table);
}

const selectionHandleTableResize = (context, {payload}) => {
  const dimension = payload.dimension;

  if (dimension.mainSize < RESIZE_MIN_SIZE)
  {
    dimension.mainSize = RESIZE_MIN_SIZE;
  }

  if (dimension.crossSize < RESIZE_MIN_SIZE)
  {
    dimension.crossSize = RESIZE_MIN_SIZE;
  }

  const table = payload.table;

  CanvasDetails.setSize(table.canvas, payload.dimension);
  Connection.updateConnections(payload.connections, table);
}

const selectionHandleCardinalityMove = (context, {payload}) => {
  const cardinality = payload.cardinality;

  Cardinality.setPosition(cardinality, payload.position);
}

export default Object.freeze({
  entry: selectionEntry,
  exit: selectionExit,
  on: {
    [MachineEvents.LOGICAL_STAGE_CLICK]: {
      internal: true,
      actions: selectionHandleStageClick
    },
    [MachineEvents.LOGICAL_KEYBOARD_CLICK]: {
      internal: true,
      actions: selectionKeyboardClick
    },
    [MachineEvents.TABLE_SELECT]: {
      internal: true,
      actions: selectionHandleTableSelection
    },
    [MachineEvents.TABLE_DOUBLE_CLICK]: {
      internal: true,
      actions: selectionHandleTableDoubleClick
    },
    [MachineEvents.TABLE_MOVE]: {
      internal: true,
      actions: selectionHandleTableMove
    },
    [MachineEvents.TABLE_RESIZE]: {
      internal: true,
      actions: selectionHandleTableResize
    },
    [MachineEvents.LOGICAL_CARDINALITY_MOVE]: {
      internal: true,
      actions: selectionHandleCardinalityMove,
    },
  }
});