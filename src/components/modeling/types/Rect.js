import Vertex from "./Vertex";

/**
 * Classe que representa um retângulo.
 */
export default class Rect
{
  /**
   * Construir um retângulo com as propriedades especificadas.
   * 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} w width
   * @param {Number} h height
   */
  constructor(x = 0, y = 0, w = 1, h = 1)
  {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  /**
   * Obter a posição do vértice superior-esquerdo (topLeft) do Retãngulo.
   * 
   * @param {Rect} rect 
   * @returns {Vertex}
   */
  static getV1(rect)
  {
    return new Vertex(rect.x, rect.y);
  }

  /**
   * Obter a posição do vértice superior-direito (topRight) do Retãngulo.
   * 
   * @param {Rect} rect 
   * @returns {Vertex}
   */
  static getV2(rect)
  {
    return new Vertex(rect.x + rect.w, rect.y);
  }

  /**
   * Obter a posição do vértice inferior-direito (bottomRight) do Retãngulo.
   * 
   * @param {Rect} rect 
   * @returns {Vertex}
   */
  static getV3(rect)
  {
    return new Vertex(rect.x + rect.w, rect.y + rect.h);
  }

  /**
   * Obter a posição do vértice inferior-esquerdo (bottomLeft) do Retãngulo.
   * 
   * @param {Rect} rect 
   * @returns {Vertex}
   */
  static getV4(rect)
  {
    return new Vertex(rect.x, rect.y + rect.h);
  }

  /**
   * Obter o boundingBox que contém os dois retângulos específicados.
   * 
   * Se no máximo um dos argumentos for null, será retornado aquele que não é null.
   * 
   * Se ambos forem null, é lançado uma exceção.
   * 
   * @param {Rect} lhs 
   * @param {Rect} rhs 
   * @returns {Rect} O boundingBox.
   */
  static getBoundingBox(lhs, rhs)
  {
    if (lhs && !rhs)
    {
      return lhs;
    }

    if (rhs && !lhs)
    {
      return rhs;
    }

    if(!lhs && !rhs)
    {
      throw Error('Expected at least one bounding box');
    }

    const x = Math.min(lhs.x, rhs.x);
    const y = Math.min(lhs.y, rhs.y);
    const w = Math.max(Rect.getV2(lhs).x, Rect.getV2(rhs).x) - x;
    const h = Math.max(Rect.getV3(lhs).y, Rect.getV3(rhs).y) - y;

    return new Rect(x, y, w, h);
  }

  x;
  y;
  w;
  h;
}