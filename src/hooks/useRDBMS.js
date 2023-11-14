import { useState } from 'react';
import sqljs from 'sql.js';

import sqlWasmURL from '../assets/sql-wasm.wasm?url';

const GET_ALL_TABLES_STATEMENT = `SELECT name FROM sqlite_schema
WHERE type='table'`;
const FIRST_RESULT = 0;

const SQL = await sqljs({
  locateFile: file => `/${file}`
});

/**
 * Gerar uma nova instância do SGBD.
 * Caso data seja passado como argumento, o banco de dados o terá como estado inicial.
 * 
 * @param {undefined | Uint8Array} data 
 * @returns {SQL.Database} SGBD
 */
function createRDBMS(data)
{
  if (data)
  {
    return new SQL.Database(data);
  }

  return new SQL.Database();
}

/**
 * Hook que define um SGBD Relacional.
 * Quando o SGBD não está sendo executado, null é retornado como dbms.
 * 
 * @returns {Object} Um objeto que agrega o SGBD e funções utilitárias.
 */
function useRDBMS()
{
  const [dbms, setDBMS] = useState(createRDBMS);
  const [isDBMSRunning, setIsDBMSRunning] = useState(true);

  /**
   * Carregar um novo SGBD com o estado de banco de dados especificado.
   * 
   * @param {Uint8Array} data 
   */
  function loadDBFromFile(data)
  {
    if (!data)
    {
      throw Error('Data is expected.');
    }

    stopDBMS();
    setDBMS(createRDBMS(data));
    setIsDBMSRunning(true);
  }

  /**
   * Parar a execução do SGBD, liberando-o da memória.
   */
  function stopDBMS()
  {
    if (isDBMSRunning)
    {
      dbms.close();
      setDBMS(null);
      setIsDBMSRunning(false);
    }
  }

  /**
   * Começar a execução do SGBD, carregando-o na memória.
   */
  function startDBMS()
  {
    stopDBMS();
    setDBMS(createRDBMS());
    setIsDBMSRunning(true);
  }

  /**
   * Exportar o estado do banco de dados.
   * 
   * @returns {Uint8Array} buffer
   */
  function exportDB()
  {
    if(isDBMSRunning)
    {
      return dbms.export();
    }

    return null;
  }

  /**
   * Obter todas as tabelas atuais do banco de dados, incluindo as suas linhas e colunas, como um objeto.
   * 
   * @returns {Object[]} As tabelas
   */
  function getAllTables()
  {
    const tables = [];

    if (!isDBMSRunning)
    {
      return tables;
    }

    const result = dbms.exec(GET_ALL_TABLES_STATEMENT);

    if (!result.length)
    {
      return tables;
    }

    const names = result[FIRST_RESULT].values;

    names.forEach(name => {
      const tableName = name[FIRST_RESULT];
      const result = dbms.exec(`SELECT * FROM ${tableName}`);

      const columns = result[FIRST_RESULT]?.columns || [];
      const rows = result[FIRST_RESULT]?.values || [];

      tables.push({
        name: tableName,
        columns,
        rows,
      })
    });

    return tables;
  }

  return {
    dbms, 
    isDBMSRunning, 
    stopDBMS, startDBMS, loadDBFromFile, getAllTables, exportDB };
}

export default useRDBMS;