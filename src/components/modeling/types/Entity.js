import { getRandomAnimal } from "../api/randomGenerator";
import CanvasDetails from "./CanvasDetails";
import Rect from "./Rect";

/**
 * Classe que representa uma Entidade do Modelo Entidade-Relacionamento.
 */
export default class Entity
{
  /**
   * Construir uma entidade com o nome e o CanvasDetails especificado.
   */
  constructor({name = getRandomAnimal(), canvas = new CanvasDetails()})
  {
    if (!name)
    {
      throw Error('An name is expected');
    }

    this.id = crypto.randomUUID();
    this.name = name;
    this.canvas = canvas;
  }

  /**
   * Atualizar a posição da Entidade.
   * 
   * @param {Entity} entity 
   * @param {Vertex} position 
   */
  static setPosition(entity, position)
  {
    CanvasDetails.setPosition(entity.canvas, position);
  }

  /**
   * Obter a BoundingBox da Entidade.
   * 
   * @param {Entity} entity 
   * @returns {Rect} O boundingBox.
   */
  static getBoundingBox(entity)
  {
    return CanvasDetails.getBoundingBox(entity.canvas);
  }

  id;
  name;
  canvas;
  type="entity";
}