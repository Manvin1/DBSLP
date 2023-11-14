/**
 * Classe que reprsenta um vértice 2D.
 */
export default class Vertex
{
  /**
   * Construir um vértice com as posições x e y especificadas.
   * @param {Number} x 
   * @param {Number} y 
   */
  constructor(x = 0, y = 0)
  {
    this.x = x;
    this.y = y;
  }
  
  /**
   * Clonar um vértice.
   * 
   * @param {Vertex} vertex 
   * @returns {Vertex}
   */
  static clone(vertex)
  {
    return new Vertex(vertex.x, vertex.y);
  }
  
  /**
   * Comparar dois vértices.
   * 
   * @param {Vertex} lhs 
   * @param {Vertex} rhs 
   * @returns {Boolean} True se forem iguais. Senão, false.
   */
  static equals(lhs, rhs)
  {
    return lhs.x === rhs.x && lhs.y === rhs.y;
  }

  x;
  y;
}