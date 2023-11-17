import { getCombinations } from "../api/combinations";
import { getRandomAnimal } from "../api/randomGenerator";
import CanvasDetails from "./CanvasDetails";
import Cardinality from "./Cardinality";
import Connection from "./Connection";

/**
 * Classe que representa uma relação do Modelo Entidade-Relacionamento.
 */
export default class Relation
{
  /**
   * Construir uma relação a partir de um nome, dos ids das entidades que participam dela, das cardinalidades dos participantes e do CanvasDetails.
   */
  constructor({name = getRandomAnimal(), entitiesIds = [], cardinalities = [], canvas = new CanvasDetails()})
  {
    this.id = crypto.randomUUID();
    this.name = name;
    this.entitiesIds = entitiesIds;
    this.cardinalities = cardinalities;
    this.canvas = canvas;
  }

  /**
   * Atualizar a posição da Relação.
   * 
   * @param {Relation} relation 
   * @param {Vertex} position 
   */
  static setPosition(relation, position)
  {
    CanvasDetails.setPosition(relation.canvas, position);
  }

  /**
   * Obter o BoundingBox da Relação.
   * 
   * @param {Relation} relation 
   * @returns {Rect} O boundingbox.
   */
  static getBoundingBox(relation)
  {
    return CanvasDetails.getBoundingBox(relation.canvas);
  }
  
  /**
   * Adicionar um participante na Relação.
   * 
   * @param {Relation} relation 
   * @param {String} id 
   */
  static addParticipant(relation, id)
  {
    relation.entitiesIds.push(id);
  }

  /**
   * Atualizar as cardinalidades dos participantes da relação.
   * 
   * Atualizar significa que será gerado uma nova instância de {@link Cardinality} pra cada combinação das entidades participantes.
   * 
   * @param {Relation} relation 
   * @param {Function} handler Callback que recebe uma combinação de participantes especifica e retorna o {@link CanvasDetails} que a cardinalidade deve ter.
   */
  static updateCardinalities(relation, handler)
  {
    const ids = relation.entitiesIds;
    const combinations = getCombinations(ids);

    const cardinalities = [];

    if (combinations)
    {
      combinations.forEach(combination => (
        cardinalities.push(
          new Cardinality({
            participantsIds: combination[0],
            canvas: handler(combination)
          }))
      ));
    }

    relation.cardinalities = cardinalities;
  }

  /**
   * Remover participante de uma relação a partir de seu id.
   * 
   * @param {Relation} relation 
   * @param {String} id 
   * @param {Connection[]} connections 
   */
  static removeParticipantById(relation, id, connections)
  {
    const ids = relation.entitiesIds;

    let i = 0;
    while(i < ids.length)
    {
      const currentId = ids[i];

      if (currentId === id)
      {
        ids.splice(i, 1);
        Connection.removeConnectionsByTipsId(connections, relation.id, id);
        continue;
      }
      ++i;
    }
  }

  id;
  name;
  entitiesIds;
  cardinalities;
  canvas;
}