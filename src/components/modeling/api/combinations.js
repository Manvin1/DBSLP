/**
 * Gerar um array que consiste das combinações de cada elemento do array usado como argumento.
 * 
 * Cada combinação é um array de dois elementos. O primeiro elemento (lhs) é um array de n elementos (lhs) e o segundo elemento é o elemento do argumento que não faz parte do lhs.
 *
 * Por exemplo, 
 * 
 * Para arr = ['A', 'B'], as combinaçãos geradas são [ [ [ 'A' ], 'B' ], [ [ 'B' ], 'A' ] ]. 
 * 
 * Para arr = ['A', 'B', 'C'], as combinaçãos geradas são [ [ [ 'A', 'B' ], 'C' ], [ [ 'A', 'C' ], 'B' ], [ [ 'B', 'C' ], 'A' ] ].
 * 
 * A combinação é sempre entre um conjunto de length - 1 elementos com o elemento restante. Assim, para um array com dois elementos, a combinação será entre um conjunto de um único elemento com o elemento restante. Para um array de três elementos, a combinação é entre um conjunto de dois elementos com o elemento restante, etc. Logo, a combinação não é feita de forma recursiva, exaustarindo todas as possibilidades.
 * 
 * @param {Array} arr O array cujo elementos serão combinados
 * @returns {Array | null} um array que consiste de combinações. Se arr tiver apenas um elemento, null é retornado.
 */
export function getCombinations(arr)
{
  if(arr.length === 1)
  {
    return null
  }

  const INITIAL_INDEX = 0;
  const LENGTH = arr.length - 1;

  const combinations = [];
  const indices = getIndices(LENGTH);

  let lastUpdatedIndex = INITIAL_INDEX + LENGTH - 1;
  for (let i = arr.length - 1; 0 <= i; --i)
  {
    combinations.push([
      subArray(indices, arr), 
      arr[i]
    ]);

    ++indices[lastUpdatedIndex];
    --lastUpdatedIndex;
  }

  return combinations;

  function subArray(indices, array)
  {
    const arr = [];
    indices.forEach(index => {
      arr.push(array[index]);
    });
    return arr;
  }

  function getIndices(length)
  {
    const arr = [];
    for(let i = 0; i < length; ++i)
    {
      arr.push(i);
    }

    return arr;
  }
}

/**
 * Extensão de {@link getCombinations} que gera combinações de forma recursiva, isso é, considerando todas as possibilidades de combinação.
 * 
 * Por exemplo, para arr = ['A', 'B', 'C', 'D'], as combinações geradas são [ [ [ 'A' ], 'B' ], [ [ 'B' ], 'A' ], [ [ 'A' ], 'C' ], [ [ 'C' ], 'A' ], [ [ 'B' ], 'C' ], [ [ 'C' ], 'B' ], [ [ 'A', 'B' ], 'C' ], [ [ 'A', 'C' ], 'B' ], [ [ 'B', 'C' ], 'A' ], [ [ 'A' ], 'D' ], [ [ 'D' ], 'A' ], [ [ 'B' ], 'D' ], [ [ 'D' ], 'B' ], [ [ 'A', 'B' ], 'D' ], [ [ 'A', 'D' ], 'B' ], [ [ 'B', 'D' ], 'A' ], [ [ 'C' ], 'D' ], [ [ 'D' ], 'C' ], [ [ 'A', 'C' ], 'D' ], [ [ 'A', 'D' ], 'C' ], [ [ 'C', 'D' ], 'A' ], [ [ 'B', 'C' ], 'D' ], [ [ 'B', 'D' ], 'C' ], [ [ 'C', 'D' ], 'B' ], [ [ 'A', 'B', 'C' ], 'D' ], [ [ 'A', 'B', 'D' ], 'C' ], [ [ 'A', 'C', 'D' ], 'B' ], [ [ 'B', 'C', 'D' ], 'A' ] ].
 * 
 * @param {Array} arr O array cujo elementos serão combinados
 * @returns {Array | null} um array que consiste de combinações. Se arr tiver apenas um elemento, null é retornado.
 */
export function getAllCombinations(arr)
{
  const combinations = [];
  const result = getCombinations(arr);

  if (!result)
  {
    return result;
  }

  for(let i = 0; i < result.length; ++i)
  {
    let [lhs, _] = result[i];
    
    if(lhs.length !== 1)
    {
      const result = getAllCombinations(lhs);
      combinations.push(...result);
    }
  }

  combinations.push(...result);
  
  return removeDuplicates(combinations);
}

/**
 * Computar a distribuição das frequência dos valores de linhas em relação aos outros valores da mesma linha.
 * 
 * O resultado é um mapa (Map-1) que consiste de todas as possibilitas de associações das colunas (Key-1). Pra cada uma dessas combinações, tem-se associado outro mapa (Map-2) (Value-1) que consiste das combinações dos diversos valores obtidos a partir das linhas especificadas (Key-2). Cada um dessas combinações de valores é associada a um outro mapa (Map-3) (Value-2) cuja chaves são todas as outras colunas que não fazem parte de Key-1 (Key-3). O valor (Value-3) desse mapa é outro Mapa (Map-4) cujo chave (Key-4) são os valores que as colunas (Key-3) tiveram, tendo como valor (Value-4) a frequência dessa ocorrência.
 * 
 * Por exemplo, para columns=['A', 'B'] e rows = [ [1, 2], [1, 2] ], o gerado é 
 * 
 * Map(2) {
    'A' => Map(1) { 
      '1' => Map(1) { 
        'B' => Map(2) {
          2 => 2,
          '__total' => 2
        }
      } 
    },
    'B' => Map(1) { 
      '2' => Map(1) { 
        'A' => Map(2) {
          1 => 2
          '__total' => 2
        }
      } 
    }
  }

 * Note que o Mapa 4 tem associado uma chava '__total', que contabiliza a quantidade de valores.
 *
 * @param {Array} columns Os nomes das colunas das linhas
 * @param {Array} rows Um array de linhas. Cada linha deve ser um array.
 * @returns {Map} um mapa.
 */
export function getValuesAssociation(columns, rows)
{
  const columnsMap = new Map();

  for(const row of rows)
  {
    const rotuledRow = rotule(row, columns);
    const combinations = getAllCombinations(rotuledRow);

    if (!combinations)
    {
      continue;
    }

    for(const [lhs, rhs] of combinations)
    {
      const rotuleKey = getKeyFromRotules(lhs);

      if (!columnsMap.has(rotuleKey))
      {
        columnsMap.set(rotuleKey, new Map());
      }

      const valueKey = getKeyFromValues(lhs);
      const valueMap = columnsMap.get(rotuleKey);
    
      if (!valueMap.has(valueKey))
      {
        valueMap.set(valueKey, new Map());
      }

      const relatedColumnKey = getKeyFromRotules(rhs)
      const relatedColumnsMap = valueMap.get(valueKey);

      if (!relatedColumnsMap.has(relatedColumnKey))
      {
        relatedColumnsMap.set(relatedColumnKey, new Map());
      }

      const relatedValuesMap = relatedColumnsMap.get(relatedColumnKey);
      const frequency = relatedValuesMap.get(rhs.value);

      if (frequency)
      {
        relatedValuesMap.set(rhs.value, frequency + 1);
      }
      else
      {
        relatedValuesMap.set(rhs.value,1);
      }

      const totalRelatedValues = relatedValuesMap.get('__total');
      relatedValuesMap.set('__total', totalRelatedValues? totalRelatedValues + 1 : 1);
    }
  }
  
  return columnsMap;
}

/**
 * Gera um objeto no formato {value, rotule} que associa os elementos do array a um rótulo de mesma posição.
 * 
 * @param {Array} arr Array que se quer rotular os elementos.
 * @param {Array} labels Um array de rotulos.
 * @returns {Array} um array cujo elementos são um objeto que rotula um valor do array original.
 */
export function rotule(arr, labels)
{
  if (arr.length !== labels.length)
  {
    throw Error('The length of labels needs to be equals to the length of the array');
  }

  return arr.map((value, i) => ({
    value, rotule: labels[i]
  }));
}

/**
 * Obter uma chave que representa o argumento a partir de seus rótulos. Se for um objeto, o seu rótulo é retornado. Se for um array de objetos, os rótulos de todos os seus elementos são concatenados e o obtido disso é retornado.
 * 
 * Os objetos devem ter a mesma interface que o gerado por {@link rotule}.
 * 
 * @param {Object[] | Object} obj 
 * @returns {String} uma chave.
 */
export function getKeyFromRotules(obj)
{
  if (obj.rotule)
  {
    return obj.rotule;
  }

  if (!Array.isArray(obj))
  {
    throw Error('An object with rotule property or an array of thats is expected.');
  }

  if (obj.length === 1)
  {
    return obj[0].rotule;
  }

  let key = '';
  obj.forEach((element,i) => {
    if(i === obj.length - 1)
    {
      key += element.rotule;
    }
    else
    {
      key += element.rotule + ', ';
    }
  })

  return key;
}

/**
 * Obter uma chave que representa o argumento a partir de seus valores. Se for um objeto, o seu valor é retornado. Se for um array de objetos, os valores de todos os seus elementos são concatenados e o obtido disso é retornado.
 * 
 * Os objetos devem ter a mesma interface que o gerado por {@link rotule}.
 * 
 * @param {Object[] | Object} obj 
 * @returns {String} uma chave.
 */
export function getKeyFromValues(obj)
{
  if (obj.value)
  {
    return String(obj.value);
  }

  if (!Array.isArray(obj))
  {
    throw Error('An object with rotule property or an array of thats is expected.');
  }

  if (obj.length === 1)
  {
    return String(obj[0].value);
  }

  let key = '';
  obj.forEach((element,i) => {
    if(i === obj.length - 1)
    {
      key += String(element.value);
    }
    else
    {
      key += String(element.value) + ', ';
    }
  })

  return key;
}

/**
 * Remover duplicações de valores de um array. A verificação é profunda, ou seja, considera arrays, propriedades de objetos, etc.
 * 
 * @param {Array} arr .
 * @returns {Array} Um novo array sem duplicações.
 */
export function removeDuplicates(arr)
{
  const result = [];
  
  for(let i = 0; i < arr.length; ++i)
  {
    const lhs = arr[i];
    
    let isUnique = true;
    for(let j = i - 1; 0 <= j; --j)
    {
      const rhs = arr[j];
      
      if (isEquals(lhs, rhs))
      {
        isUnique = false;
        break;
      }
    }
    
    if(isUnique)
    {
      result.push(lhs);
    }
  }
  
  return result;
}

/**
 * Verifica a igualdade entre os argumentos. A igualdade é estrita e diferencia tipos primitivos, objetos, arrays e mapas. Outras estruturas não são suportadas e o resultado é não-especificado.
 * 
 * Para arrays, a ordem dos elementos deve ser igual para que os arrays sejam considerados iguais.
 * 
 * @param {*} lhs 
 * @param {*} rhs 
 * @returns {Boolean} true se forem iguais, false senão.
 */
export function isEquals(lhs, rhs)
{
  if (lhs === rhs)
  {
    return true;
  }
  
  if(typeof lhs !== 'object' || typeof rhs !== 'object')
  {
    return false;
  }

  if(lhs === null || rhs === null)
  {
    return false;
  }

  if (Array.isArray(lhs) && Array.isArray(rhs))
  {
    if (lhs.length !== rhs.length)
    {
      return false;
    }
    
    for(let i = 0; i < lhs.length; ++i)
    {
      const lhsElement = lhs[i];
      const rhsElement = rhs[i];
      
      if (!isEquals(lhsElement, rhsElement))
      {
        return false;
      }
    }
    
    return true;
  }

  if (lhs instanceof Map && rhs instanceof Map)
  {
    if (lhs.size !== rhs.size)
    {
      return false;
    }

    for(const [key, value] of lhs)
    {
      if (!rhs.has(key))
      {
        return false;
      }

      if (!isEquals(rhs.get(key), value))
      {
        return false;
      }
    }

    return true;
  }

  const entries = Object.entries(lhs);

  for(let i = 0; i < entries.length; ++i)
  {
    const [key, value] = entries[i];

    if (!isEquals(rhs[key], value))
    {
      return false;
    }
  }

  return true;
}