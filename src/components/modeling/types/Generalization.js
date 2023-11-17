import { getRandomAnimal } from "../api/randomGenerator";
import CanvasDetails from "./CanvasDetails";
import Dimension from "./Dimension";
import Vertex from "./Vertex";

export const DEFAULT_GENERALIZATION_TYPE_DIMENSION = new Dimension(40, 40);

/**
 * Enum que representa os tipos de generalizações.
 */
export const GeneralizationTypes = Object.freeze({
  exclusive_total: 'exclusive_total',
  exclusive_parcial: 'exclusive_parcial',
  shared_total: 'shared_total',
  shared_parcial: 'shared_parcial',
});

/**
 * Classe que representa os tipos de Generalizações de generalizações do Modelo Entidade-Relacionamento.
 */
export class GeneralizationType
{
  /**
   * Construir uma GeneralizationType a partir de um tipo e de CanvasDetails.
   */
  constructor({type = GeneralizationTypes.exclusive_total, canvas = new CanvasDetails({})})
  {
    this.id = crypto.randomUUID();
    this.type = type;
    this.canvas = canvas;
  }

  /**
   * Obter a representação de um tipo de generalização.
   * 
   * @param {GeneralizationTypes} type 
   * @returns {String} A representação.
   */
  static getTypeRepresentation(type)
  {
    switch(type)
    {
      case GeneralizationTypes.exclusive_total: return 'xt';
      case GeneralizationTypes.exclusive_parcial: return 'xp';
      case GeneralizationTypes.shared_total: return 'ct';
      case GeneralizationTypes.shared_parcial: return 'cp';
      default: throw Error(`Unknown type ${type}`);
    }
  }

  /**
   * Obter a representação de um tipo de generalização.
   * 
   * @param {GeneralizationType} type 
   * @returns {String} A representação.
   */
  static getRepresentation(genType)
  {
    return GeneralizationType.getTypeRepresentation(genType.type);
  }

  /**
   * Atualizar a posição de uma GeneralizationType
   * 
   * @param {GeneralizationType} genType 
   * @param {Vertex} position 
   */
  static setPosition(genType, position)
  {
    CanvasDetails.setPosition(genType.canvas, position);
  }

  /**
   * Obter o BoundingBox de uma GeneralizationType.
   * 
   * @param {GeneralizationType} genType 
   * @returns {Rect} O boundingBox.
   */
  static getBoundingBox(genType)
  {
    return CanvasDetails.getBoundingBoxAbs(genType.canvas);
  }

  id;
  type;
  canvas;
}

/**
 * Classe que representa uma Generalização do Modelo Entidade-Relacionamento.
 */
export default class Generalization
{
  /**
   * Construir uma generalização para uma entidade base, um conjunto de entidades derivadas com um tipo específico e com um CanvasDetails.
   */
  constructor({baseId = null, derivedsIds = [], canvas = new CanvasDetails(), genType = new GeneralizationType({canvas: new CanvasDetails({position: Vertex.clone(canvas.position), dimension: Dimension.clone(DEFAULT_GENERALIZATION_TYPE_DIMENSION)})})})
  {
    this.id = crypto.randomUUID();
    this.baseId = baseId;
    this.derivedsIds = derivedsIds;
    this.genType = genType;
    this.canvas = canvas;
  }

  /**
   * Atualizar a posição da Generalização.
   * 
   * @param {Generalization} generalization 
   * @param {Vertex} position 
   */
  static setPosition(generalization, position)
  {
    CanvasDetails.setPosition(generalization.canvas, position);
  }

  /**
   * Obter o BoundingBox da Generalization.
   * 
   * @param {Generalization} generalization 
   * @returns {Rect} O boundingBOX.
   */
  static getBoundingBox(generalization)
  {
    return CanvasDetails.getBoundingBox(generalization.canvas);
  }

  id;
  baseId;
  derivedsIds;
  genType;
  canvas;
}
