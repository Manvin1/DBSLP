import React from 'react';

import { Group, Text } from 'react-konva';
import { Constraint } from '../types/Table';

/**
 * Componente que representa uma linha que especifica as restrições da Tabela.
 * 
 * Cada restrição deve estar previamente populada com as colunas que a participam em uma propriedade 'columns'.
 */
function TableConstraintRow({y, height, columnPadding, columnWidth, constraint, fontSize}) {
  let xPosition = columnPadding;
  
  return (
    <Group
      x={0}
      y={y}>
      <Text
        x={xPosition}
        y={0}
        width={columnWidth}
        height={height}
        align='left'
        verticalAlign='middle'
        fontSize={fontSize}
        text={Constraint.getRepresentation(constraint)} />
      
      <Text
        x={xPosition += columnWidth + columnPadding}
        y={0}
        width={columnWidth}
        height={height}
        align='left'
        verticalAlign='middle'
        fontSize={fontSize}
        text={
          constraint.columns.length? `(${constraint.columns
            .map(column => column.name)
            .join(', ')})` : '-'
        } />

        <Text
          x={xPosition += columnWidth + columnPadding}
          y={0}
          width={columnWidth}
          height={height}
          align='center'
          verticalAlign='middle'
          fontSize={fontSize}
          text={constraint.reference && constraint.reference.table ? constraint.reference.table.name : '-'} />

        <Text
          x={xPosition += columnWidth + columnPadding}
          y={0}
          width={columnWidth}
          height={height}
          align='center'
          verticalAlign='middle'
          fontSize={fontSize}
          text={
            constraint.reference 
              && constraint.reference.table
              && constraint.reference.columnsIds.length? 
            `(${constraint.reference.table.columns
              .filter(column => constraint.reference.columnsIds.includes(column.id))
              .map(column => column.name)
              .join(', ')})` : '-'
          } />
    </Group>
  )
}

export default TableConstraintRow