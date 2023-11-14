import React from 'react'

import { Group, Line, Text } from 'react-konva'

/**
 * Componente que representa o título de uma Tabela.
 */
function TableTitle({x, y, width, height, title, fontSize}) {

  return (
    <Group
      x={x}
      y={y}>
      <Text
        x={0}
        y={0}
        width={width}
        height={height}
        align='center'
        verticalAlign='middle'
        fontSize={fontSize}
        text={title} />
      <Line
        points={[x, height, (x+width), height]}
        stroke='black'
        strokeWidth={2}/>
    </Group>
  )
}

export default TableTitle