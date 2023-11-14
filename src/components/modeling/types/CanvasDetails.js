import Vertex  from "./Vertex";
import Dimension  from "./Dimension";
import Rect from "./Rect";

/**
 * Classe que representa os detalhes de canvas, como posição e dimensão.
 * É usada por figuras que tem uma representação no canvas.
 */
export default class CanvasDetails
{
  /**
   * Construir um noco CanvasDetails com a posição e a dimensão especificada.
   */
  constructor({position = new Vertex(), dimension = new Dimension(100, 70)})
  {
    this.position = position;
    this.dimension = dimension;
  }

  /**
   * Clonar profundamente (deep copy) uma instância de CanvasDetails.
   * 
   * @param {CanvasDetails} canvas 
   * @returns {CanvasDetails}
   */
  static clone(canvas)
  {
    return new CanvasDetails({
      position: new Vertex(canvas.position.x, canvas.position.y),
      dimension: new Dimension(canvas.dimension.mainSize, canvas.dimension.crossSize)
    })
  }

  /**
   * Atualizar a posição de um CanvasDetails.
   * 
   * @param {CanvasDetails} canvas 
   * @param {Vertex} position 
   */
  static setPosition(canvas, position)
  {
    canvas.position = position;
  }

  /**
   * Atualizar a dimensão de um CanvasDetails.
   * 
   * @param {CanvasDetails} canvas 
   * @param {Dimension} dimension 
   */
  static setSize(canvas, dimension)
  {
    canvas.dimension = dimension;
  }

  /**
   * Atualizar a dimensão principal de um CanvasDetails.
   * 
   * @param {CanvasDetails} canvas 
   * @param {Number} size 
   */
  static setMainSize(canvas, size)
  {
    if(!Number.isFinite(size))
    {
      throw Error('An number is expected');
    }

    canvas.dimension.mainSize = size;
  }

  /**
   * Atualizar a dimensão secundária de um CanvasDetails.
   * 
   * @param {CanvasDetails} canvas 
   * @param {Number} size 
   */
  static setCrossSize(canvas, size)
  {
    if(!Number.isFinite(size))
    {
      throw Error('An number is expected');
    }

    canvas.dimension.crossSize = size;
  }

  /**
   * Obter o bounding box associado a um CanvasDetails. 
   * 
   * A posição atual é sempre considerada como o centro do retângulo.
   * 
   * @param {CanvasDetails} canvas 
   * @returns {Rect} BoundingBox
   */
  static getBoundingBox(canvas)
  {
    const width = canvas.dimension.mainSize;
    const height = canvas.dimension.crossSize;
    const x = canvas.position.x - width/2;
    const y = canvas.position.y - height/2;

    return new Rect(x, y, width, height);
  }

  /**
   * Obter o bounding box associado a um CanvasDetails. 
   * 
   * A posição atual é considerada como a extremidade esquerda-superior do retângulo.
   * 
   * @param {CanvasDetails} canvas 
   * @returns {Rect} BoundingBox
   */
  static getBoundingBoxAbs(canvas)
  {
    const width = canvas.dimension.mainSize;
    const height = canvas.dimension.crossSize;
    const x = canvas.position.x;
    const y = canvas.position.y;

    return new Rect(x, y, width, height);
  }

  position;
  dimension;
}
