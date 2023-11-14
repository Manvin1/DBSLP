import CanvasDetails from "./CanvasDetails";
import Dimension from "./Dimension";

export const CardinalityTypes = Object.freeze({
  monovalue_optional: 'monovalue_optional',
  monovalue_required: 'monovalue_required',
  multivalue_optional: 'multivalue_optional',
  multivalue_required: 'multivalue_required',
});

export const DEFAULT_CARDINALITY_DIMENSION = new Dimension(60, 20);

/**
 * Classe que representa uma unidade de cardinalidade de uma associação.
 */
export default class Cardinality
{
  /**
   * Construir uma cardinalidade a partir de seu tipo, de seus participantes e de seu CanvasDetails.
   */
  constructor({cardType = CardinalityTypes.monovalue_required, participantsIds, canvas = new CanvasDetails()})
  {
    this.id = crypto.randomUUID();
    this.cardType = cardType;
    this.participantsIds = participantsIds;
    this.canvas = canvas;
  }

  /**
   * Obter a representação UML de um tipo de cardinalidade.
   * 
   * @param {CardinalityTypes} type 
   * @returns {String} A representação.
   */
  static getUMLRepresentationByType(type)
  {
    switch(type)
    {
      case CardinalityTypes.monovalue_optional: return '0..1';
      case CardinalityTypes.monovalue_required: return '1..1';
      case CardinalityTypes.multivalue_optional: return '0..*';
      case CardinalityTypes.multivalue_required: return '1..*';
      default: throw Error(`Unknown type ${type}`);
    }
  }

  /**
   * Obter a representação Chang de um tipo de cardinalidade.
   * 
   * @param {CardinalityTypes} type 
   * @returns {String} A representação
   */
  static getChangRepresentationByType(type)
  {
    switch(type)
    {
      case CardinalityTypes.monovalue_optional: return '(0,1)';
      case CardinalityTypes.monovalue_required: return '(1,1)';
      case CardinalityTypes.multivalue_optional: return '(0,N)';
      case CardinalityTypes.multivalue_required: return '(1,N)';
      default: throw Error(`Unknown type ${type}`);
    }
  }

  /**
   * Obter a representação Chang de uma Cardinalidade
   * @param {Cardinality} cardinality 
   * @returns {String} A representação
   */
  static getChangRepresentation(cardinality)
  {
    return Cardinality.getChangRepresentationByType(cardinality.cardType);
  }

    /**
   * Obter a representação UML de uma Cardinalidade
   * @param {Cardinality} cardinality 
   * @returns {String} A representação
   */
  static getUMLRepresentation(cardinality)
  {
    return Cardinality.getUMLRepresentationByType(cardinality.cardType);
  }

  /**
   * Atualizar a posição de uma cardinalidade.
   * 
   * @param {Cardinality} cardinality 
   * @param {Vertex} position 
   */
  static setPosition(cardinality, position)
  {
    CanvasDetails.setPosition(cardinality.canvas, position);
  }

  /**
   * Obter o BoundingBox de uma cardinalidade.
   * 
   * @param {Cardinality} cardinality 
   * @returns {Rect} O boundingBox.
   */
  static getBoundingBox(cardinality)
  {
    return CanvasDetails.getBoundingBoxAbs(cardinality.canvas);
  }

  id;
  cardType;
  participantsIds;
  canvas;
}