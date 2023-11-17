/**
 * Constructor para criar um documento para representar a modelagem conceitual conforme o modelo Entidade-Relacionamento.
 * 
 * @param {Object} object 
 * 
 * @returns {ConceptualStore}
 */
export default function ConceptualStore(object)
{
  if(new.target)
  {
    throw Error('ConceptualStore cannot be used in new expressions.');
  }

  object.entities = [];
  object.relations = [];
  object.attributes = [];
  object.generalizations = [];
  object.connections = [];

  return object;
}