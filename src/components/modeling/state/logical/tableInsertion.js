/**
 * @file tableInsertion.js
 * 
 * Este arquivo contém o objeto que representa um estado de uma State Machine e as funções que reagem a eventos lançados quando a máquina está nesse estado.
 * 
 * O estado de inserção de tabelas possibilita que o usuário insira uma nova tabela.
 * 
 * Toda reação *nunca* muda o estado, realizando uma auto transição interna.
 */

import { assign } from "xstate";

import CanvasDetails from "../../types/CanvasDetails";
import Dimension from "../../types/Dimension";
import Table from "../../types/Table";
import MachineEvents from "./MachineEvents";

const defaultDimension = new Dimension(300, 100);

const tableInsertionEntry = assign({
  payload: {

  }
});

const tableInsertionHandleStageClick = (context, {payload}) => {

  const table = new Table({
    canvas: new CanvasDetails(
    {
      position: payload.position,
      dimension: Dimension.clone(defaultDimension)
    })
  });

  const store = payload.store;

  store.logical.tables.push(table);
}

export default Object.freeze({
  entry: tableInsertionEntry,
  on: {
    [MachineEvents.STAGE_CLICK]: {
      internal: true,
      actions: tableInsertionHandleStageClick,
    }
  }
})