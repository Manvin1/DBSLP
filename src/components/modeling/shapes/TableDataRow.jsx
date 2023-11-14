import React from 'react';

import { Group, Text } from 'react-konva';

/**
 * Componente que representa uma linha que especifica as características de uma coluna.
 * 
 * Cada coluna deve ser previamente populada com a sua representação textual quanto as suas restrições em uma propriedade 'constraints'.
 */
function TableDataRow({y, height, columnPadding, columnWidth, column, fontSize}) {
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
        text={column.name} />
      
      <Text
        x={xPosition += columnWidth + columnPadding}
        y={0}
        width={columnWidth}
        height={height}
        align='left'
        verticalAlign='middle'
        fontSize={fontSize}
        text={column.dataType || '-'} />

      <Text
        x={xPosition += columnWidth + columnPadding}
        y={0}
        width={columnWidth}
        height={height}
        align='center'
        verticalAlign='middle'
        fontSize={fontSize}
        text={column.constraints.length? column.constraints.join(', ') : '-'} />

      <Text
        x={xPosition += columnWidth + columnPadding}
        y={0}
        width={columnWidth}
        height={height}
        align='center'
        verticalAlign='middle'
        fontSize={fontSize}
        text={column.isRequired? 'REQ' : 'OPT'} />
    </Group>
  )
}

export default TableDataRow