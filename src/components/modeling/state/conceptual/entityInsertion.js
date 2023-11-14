/**
 * @file entityInsertion.js
 * 
 * Este arquivo contém o objeto que representa um estado de uma State Machine e as funções que reagem a eventos lançados quando a máquina está nesse estado.
 * 
 * O estado de inserção de entidades possibilita que o usuário insira uma nova entidade.
 * 
 * Toda reação *nunca* muda o estado, realizando uma auto transição interna.
 */

import { assign } from "xstate";

import CanvasDetails from "../../types/CanvasDetails";
import Dimension from "../../types/Dimension";
import Entity from "../../types/Entity";
import MachineEvents from "./MachineEvents";

const defaultDimension = new Dimension(100, 100);

const entityInsertionEntry = assign({
  payload: {

  }
});

const entityInsertionHandleStageClick = (context, {payload}) => {

  const entity = new Entity({
    canvas: new CanvasDetails(
    {
      position: payload.position,
      dimension: Dimension.clone(defaultDimension)
    })
  });

  const store = payload.store;

  store.conceptual.entities.push(entity);
}

export default Object.freeze({
  entry: entityInsertionEntry,
  on: {
    [MachineEvents.STAGE_CLICK]: {
      internal: true,
      actions: entityInsertionHandleStageClick,
    }
  }
})