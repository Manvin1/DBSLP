import React from 'react';

import { Group } from 'react-konva';

import TableDataRow from './TableDataRow';

/**
 * Componente que representa o corpo de uma Tabela. É no corpo que estão as linhas.
 * 
 * Cada coluna deve ser previamente populada com a sua representação textual quanto as suas restrições em uma propriedade 'constraints'.
 */
function TableBody({x, y, rowHeight, rowPadding, columnWidth, columnPadding, fontSize, columns, fill}) {
  if (!columns.length)
  {
    return;
  }

  let yOffset = -(rowHeight + rowPadding);

  return (
    <Group
      x={x}
      y={y}
      fill={fill}>
      {
        columns.map(column => {
          yOffset += rowHeight + rowPadding;

          return (
            <TableDataRow
              key={column.id}
              y={yOffset}
              height={rowHeight}
              columnPadding={columnPadding}
              columnWidth={columnWidth}
              column={column}
              fontSize={fontSize}/>
          )
        })
      }
    </Group>
  )
}

export default TableBody