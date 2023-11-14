import React from 'react';

import Tree, { TreeNode } from 'rc-tree';

import "rc-tree/assets/index.css";
import { useAppContext } from '../../contexts/global/AppContext';

/**
 * Função de critério usada para ordenar objetos pelo nome.
 * 
 * @param {*} lhs 
 * @param {*} rhs 
 * @returns Se lhs for posicionado antes que rhs, -1. Se posicionado depois, 1. Senão, 0.
 */
function sortByName(lhs, rhs) {
  return lhs.name < rhs.name ? -1 : lhs.name === rhs.name ? 0 : 1;
}

/**
 * Componente que representa a hierarquia dos participantes da Cena do Modelo Relacional.
 * 
 * Essa hierarquia apresenta as Tabelas, seus atributos e suas tuplas.
 */
function LogicalSceneTab() {
  const {store} = useAppContext();;

  const tables = store.logical.tables
    .map(table => {
      return {
        ...table,
        columns: table.columns.toSorted(sortByName),
      }
    })
    .toSorted(sortByName);

  const associations = store.logical.associations
    .map(association => {
      const tables = association.tablesIds
        .map(id => store.logical.tables.find(table => table.id === id))
        .toSorted(sortByName);

      return {
        ...association,
        tables
      }
    })
    .toSorted(sortByName);

  return (
    <Tree 
      onSelect={(selectedKeys, e) => {console.log(selectedKeys, e)}}
      showIcon={false} 
      defaultExpandAll >
      <TreeNode title='Cena' key='Cena'>
        <TreeNode title='Tabelas' key='tables'>
          {
            tables.map(table => (
              <TreeNode title={table.name} key={table.id}>
                <TreeNode title='Colunas' key={`${table.id}_columns`}>
                  {
                    table.columns.map(column => (
                      <TreeNode key={column.id} title={column.name} />
                    ))
                  }
                </TreeNode>
              </TreeNode>
            ))
          }
        </TreeNode>
        <TreeNode title='Associações' key='associations'>
          {
            associations.map(association => (
              <TreeNode title={association.name} key={association.id}>
                <TreeNode title='Participantes' key={`${association.id}_participants`}>
                  {
                    association.tables.map(table => (
                      <TreeNode key={`${association.id}_${table.id}`} title={table.name}>
                      </TreeNode>
                    ))
                  }
                </TreeNode>
              </TreeNode>
            ))
          }
        </TreeNode>
      </TreeNode>
    </Tree>
  )
}

export default LogicalSceneTab