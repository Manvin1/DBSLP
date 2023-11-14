import React from 'react';

import Tree, { TreeNode } from 'rc-tree';

import "rc-tree/assets/index.css";
import { useDBMSContext } from '../../contexts/DBMScontext';
import { useLabContext } from '../../contexts/LabContext';

/**
 * Componente que representa a hierarquias de tabelas atuais no banco de dados, incluindo as suas linhas.
 */
function TablesView() {
  const { 
    history
  } = useLabContext();

  const {dbServices} = useDBMSContext();

  const tables = dbServices.getAllTables();

  return (
    <Tree 
      onSelect={(selectedKeys, e) => {
        //nothing
      }}
      showIcon={false} 
      defaultExpandAll >
      <TreeNode title='Tabelas' key='tables'>
        {
          tables.map(table => (
            <TreeNode 
              title={table.name} 
              key={table.name}>
              {
                table.columns? (
                  <TreeNode 
                  title={table.columns.join(', ')} 
                  key={`${table.name}_columns`} />
                ) : undefined
              }
              {
                table.rows.map((row,i) => (
                  <TreeNode 
                    title={row.join(', ')} 
                    key={`${table.name}_${i}`} />
                ))
              }
            </TreeNode>
          ))
        }
      </TreeNode>
    </Tree>
  )
}

export default TablesView