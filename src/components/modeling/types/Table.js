import { getRandomAnimal } from "../api/randomGenerator";
import CanvasDetails from "./CanvasDetails";

/**
 * Enum que representa os tipos de restrições.
 */
export const ConstraintsType = Object.freeze({
  primary_key: 'primary_key',
  foreign_key: 'foreign_key',
  unique_key: 'unique_key',
});

/**
 * Classe que representa uma referência (foreign key) para uma tabela. 
 */
export class Reference
{
  /**
   * Construir uma referência para a tabela e colunas especificados a partir de seus respectivos ids.
   */
  constructor({tableId = null, columnsIds = []})
  {
    this.tableId = tableId;
    this.columnsIds = columnsIds;
  }

  tableId;
  columnsIds;
}

/**
 * Classe que representa uma restrição.
 */
export class Constraint
{
  /**
   * Construir uma restrição com o nome, tipo, colunas participantes e tabela referenciada, se alguma, especificados.
   */
  constructor({name=getRandomAnimal(), type, columnsIds=[], reference = null})
  {
    if (!type)
    {
      throw Error('An type is expected');
    }

    this.id = crypto.randomUUID();
    this.type = type;
    this.name = name;
    this.columnsIds = columnsIds;
    this.reference = reference;
  }

  /**
   * Obter uma representação textual para o tipo de Constraint.
   * 
   * @param {ConstraintsType} type 
   * @returns {String}
   */
  static getTypeRepresentation(type)
  {
    switch(type)
    {
      case ConstraintsType.foreign_key: return `FK`;
      case ConstraintsType.primary_key: return `PK`;
      case ConstraintsType.unique_key: return `U`;
    }
  }

  /**
   * Obter uma representação textual para a Constraint.
   * 
   * @param {Constraint} constraint 
   * @returns {String}
   */
  static getRepresentation(constraint)
  {
    switch(constraint.type)
    {
      case ConstraintsType.foreign_key: return `FK(${constraint.name})`;
      case ConstraintsType.primary_key: return `PK(${constraint.name})`;
      case ConstraintsType.unique_key: return `U(${constraint.name})`;
    }
  }

  id;
  type;
  name;
  columnsIds;
  reference;
}

/**
 * Classe que representa uma coluna de uma Tabela. 
 * 
 * Nesse contexto, a representação especifica as propriedades de uma coluna da tabela.
 */
export class Column
{
  /**
   * Construir uma coluna com o nome, tipo de dados e opcionalidade especificos.
   */
  constructor({name=getRandomAnimal(), dataType = '', isRequired=true})
  {
    this.id = crypto.randomUUID();
    this.name = name;
    this.dataType = dataType;
    this.isRequired = isRequired;
  }

  id;
  name;
  dataType;
  isRequired;
}

/**
 * Classe que representa uma Tabela.
 * 
 * Nesse contexto, a representação especifica o título, as colunas e as restrições das colunas associadas a Tabela.
 */
export default class Table
{
  /**
   * Construir uma tabela com o nome, colunas, restrições e CanvasDetails especificados.
   */
  constructor({name=getRandomAnimal(), columns=[], constraints=[], canvas = new CanvasDetails()})
  {
    this.id = crypto.randomUUID();
    this.name = name;
    this.columns = columns;
    this.constraints = constraints;
    this.canvas = canvas;
  }

  /**
   * Atualizar a posição da Tabela.
   * 
   * @param {Table} table 
   * @param {Vertex} position 
   */
  static setPosition(table, position)
  {
    table.canvas.position = position;
  }

  /**
   * Obter o BoundingBox da Tabela.
   * 
   * @param {Table} table 
   * @returns {Rect} O boundingBox.
   */
  static getBoundingBox(table)
  {
    return CanvasDetails.getBoundingBox(table.canvas);
  }
  
  id;
  name;
  columns;
  constraints;
  canvas;
}