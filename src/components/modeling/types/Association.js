/**
 * Classe que representa uma associação entre tabelas.
 */
export default class Association
{
  /**
   * Construir uma associação a partir do id das tabelas participantes e das suas cardinalidades na associação.
   */
  constructor({tablesIds = [], cardinalities = []})
  {
    this.id = crypto.randomUUID();
    this.tablesIds = tablesIds;
    this.cardinalities = cardinalities;
  }

  id;
  tablesIds;
  cardinalities;
}