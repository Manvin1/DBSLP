/**
 * Classe que representa uma Dimensão.
 * 
 * Uma dimensão consiste de um tamanho principal (mainSize) e um tamanho secundário (crossSize).
 */
export default class Dimension
{
  constructor(mainSize = 1, crossSize = 1)
  {
    this.mainSize = mainSize;
    this.crossSize = crossSize;
  }

  static clone(dimension)
  {
    return new Dimension(dimension.mainSize, dimension.crossSize);
  }

  mainSize;
  crossSize;
}