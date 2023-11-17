import { getRandomAnimal } from "../api/randomGenerator";
import CanvasDetails from "./CanvasDetails";

/**
 * Enum que especifica os tipos de figuras que podem possuir um Atributo.
 */
export const AttributeOwnerTypes = Object.freeze({
  entity: 'entity',
  relation: 'relation'
});

/**
 * Classe que representa um Atributo do Modelo Entidade-Relacionamento.
 */
export default class Attribute
{
  /**
   * Construir um atributo a partir de um nome, possuidor e canvasDetails.
   * 
   * O owner é no formato {id, type}.
   */
  constructor({name = getRandomAnimal(), owner, canvas = new CanvasDetails()})
  {
    this.id = crypto.randomUUID();
    this.name = name;
    this.owner = owner;
    this.canvas = canvas;
  }

  /**
   * Encontrar o possuidor de um atributo a partir da busca do seu tipo e id em uma store.
   * 
   * @param {Attribute} attribute 
   * @param {MappedTypeDescription<{conceptual: {};logical: {};}} store 
   * 
   * @returns {Entity | Attribute | null}
   * 
   * @throws Se o tipo do possuidor for desconhecido.
   */
  static getOwnerByIdAndType(attribute, store)
  {
    const owner = attribute.owner;

    if (!owner)
    {
      return null;
    }
    
    switch(owner.type)
    {
      case AttributeOwnerTypes.entity: return store.conceptual.entities.find(entity => entity.id === owner.id);
      case AttributeOwnerTypes.relation: return store.conceptual.relations.find(relation => relation.id === owner.id)
      default: throw Error('Unexpected Owner Type');
    }
  }

  /**
   * Definir o possuidor de um atributo.
   * 
   * @param {Attribute} attribute 
   * @param {String} id 
   * @param {String} type 
   */
  static setOwner(attribute, id, type)
  {
    attribute.owner = {id, type};
  }

  /**
   * Definir a posição de um atributo
   * 
   * @param {Attribute} attribute 
   * @param {Vertex} position 
   */
  static setPosition(attribute, position)
  {
    CanvasDetails.setPosition(attribute.canvas, position);
  }

  /**
   * Obter a bounding box de um atributo.
   * 
   * @param {Attribute} attribute 
   * @returns {Rect} bounding box
   */
  static getBoundingBox(attribute)
  {
    return CanvasDetails.getBoundingBox(attribute.canvas);
  }

  id;
  name;
  owner;
  isIdentifier = false;
  canvas;
}
