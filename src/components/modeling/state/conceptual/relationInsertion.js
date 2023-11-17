/**
 * @file relationInsertion.js
 * 
 * Este arquivo contém o objeto que representa um estado de uma State Machine e as funções que reagem a eventos lançados quando a máquina está nesse estado.
 * 
 * O estado de inserção de relações possibilita que o usuário insira uma nova relação.
 * 
 * Toda reação *nunca* muda o estado, realizando uma auto transição interna.
 */


import { getRandomAnimal } from "../../api/randomGenerator";
import CanvasDetails from "../../types/CanvasDetails";
import Dimension from "../../types/Dimension";
import Relation from "../../types/Relation";
import MachineEvents from "./MachineEvents";

const defaultDimension = new Dimension(100, 100);

const relationInsertionHandleStageClick = (context, {payload}) => {

  const relation = new Relation({
    name: getRandomAnimal(),
    canvas: new CanvasDetails(
    {
      position: payload.position,
      dimension: Dimension.clone(defaultDimension)
    })
  });

  const store = payload.store;

  store.conceptual.relations.push(relation);
}

export default Object.freeze({
  on: {
    [MachineEvents.CONCEPTUAL_STAGE_CLICK]: {
      internal: true,
      actions: relationInsertionHandleStageClick,
    }
  }
})