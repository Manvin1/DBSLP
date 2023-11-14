import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';

const config = {
  dictionaries: [colors, animals],
  separator: '',
  style: 'capital',
  length: '2'
}

/**
 * Obter o nome de um animal aleatório no formato 'corNome'.
 * 
 * @returns {String} o nome de um animal.
 */
export function getRandomAnimal()
{
  return uniqueNamesGenerator(config);
}