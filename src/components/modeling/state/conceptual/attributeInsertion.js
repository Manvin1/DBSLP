/**
 * @file attributeInsertion.js
 * 
 * Este arquivo contém o objeto que representa um estado de uma State Machine e as funções que reagem a eventos lançados quando a máquina está nesse estado.
 * 
 * O estado de inserção de atributos possibilita que o usuário insira uma novo atributo.
 * 
 * Toda reação *nunca* muda o estado, realizando uma auto transição interna.
 */

import { assign } from "xstate";

import { getRandomAnimal } from "../../api/randomGenerator";
import Attribute from "../../types/Attribute";
import CanvasDetails from "../../types/CanvasDetails";
import Dimension from "../../types/Dimension";
import MachineEvents from "./MachineEvents";

const defaultDimension = new Dimension(100, 70);

const attributeInsertionEntry = assign({
  payload: { }
});

const attributeInsertionHandleStageClick = (context, {payload}) => {
  const attribute = new Attribute({
    name: getRandomAnimal(),
    canvas: new CanvasDetails(
    {
      position: payload.position,
      dimension: Dimension.clone(defaultDimension)
    })
  });

  const store = payload.store;
  store.conceptual.attributes.push(attribute);
}

export default Object.freeze({
  entry: attributeInsertionEntry,
  on: {
    [MachineEvents.STAGE_CLICK]: {
      internal: true,
      actions: attributeInsertionHandleStageClick,
    }
  }
})