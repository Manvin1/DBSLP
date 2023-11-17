/**
 * @file generalizationInsertion.js
 * 
 * Este arquivo contém o objeto que representa um estado de uma State Machine e as funções que reagem a eventos lançados quando a máquina está nesse estado.
 * 
 * O estado de inserção de generalizações possibilita que o usuário insira uma nova generalização.
 * 
 * Toda reação *nunca* muda o estado, realizando uma auto transição interna.
 */


import CanvasDetails from "../../types/CanvasDetails";
import Dimension from "../../types/Dimension";
import Generalization from "../../types/Generalization";
import MachineEvents from "./MachineEvents";

const defaultDimension = new Dimension(100, 100);

const generalizationInsertionHandleStageClick = (context, {payload}) => {

  const generalization = new Generalization({
    canvas: new CanvasDetails({
      position: payload.position,
      dimension: Dimension.clone(defaultDimension)
    })
  });
  const store = payload.store;
  store.conceptual.generalizations.push(generalization);
}

export default Object.freeze({
  on: {
    [MachineEvents.CONCEPTUAL_STAGE_CLICK]: {
      internal: true,
      actions: generalizationInsertionHandleStageClick,
    }
  }
})