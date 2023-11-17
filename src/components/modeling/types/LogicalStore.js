/**
 * Constructor para criar um documento para representar a modelagem lógica conforme o modelo Relacional.
 * 
 * @param {Object} object 
 * 
 * @returns {LogicalStore}
 */
export default function LogicalStore(object)
{
  if(new.target)
  {
    throw Error('LogicalStore cannot be used in new expressions.');
  }

  object.tables = [];
  object.associations = [];
  object.connections = [];

  return object;
}