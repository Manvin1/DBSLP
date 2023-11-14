import React from 'react'
import TableDataRow from './TableDataRow'
import { Group, Line, Rect, Text } from 'react-konva'
import TableConstraintRow from './TableConstraintRow';
import { Constraint } from '../types/Table';

function sortConstraintByRepresentation(lhs, rhs)
{
  const lhsText = Constraint.getRepresentation(lhs);
  const rhsText = Constraint.getRepresentation(rhs);

  return lhsText < rhsText? -1 
    : lhsText === rhsText? 0 
    : 1;
}

/**
 * Componente que representa a seção de restrições da Tabela.
 * 
 * Cada restrição deve estar previamente populada com as colunas que a participam em uma propriedade 'columns'.
 */
function TableConstraints({x, y, width, rowHeight, rowPadding, columnWidth, columnPadding, fontSize, constraints, title, fill}) {

  if (!constraints.length)
  {
    return null;
  }

  let yOffset = -rowHeight;

  return (
    <Group
      x={x}
      y={y}
      fill={fill}>
      <Line
        stroke='black'
        strokeWidth={2}
        points={[0, 0, width, 0]} />
      {
        constraints
          .toSorted(sortConstraintByRepresentation)
          .map(constraint => {
          yOffset += rowHeight + rowPadding;

          return (
            <TableConstraintRow
              y={yOffset}
              title={title}
              height={rowHeight}
              columnPadding={columnPadding}
              columnWidth={columnWidth}
              constraint={constraint}
              fontSize={fontSize}/>
          )
        })
      }
    </Group>
  )
}

export default TableConstraints