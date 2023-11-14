import React, { Fragment } from 'react';

import { Circle, Line } from 'react-konva';

import Vertex from '../types/Vertex';

const FILL = 'transparent';
const RADIUS = 30;

/**
 * Componente que representa uma conexão entre duas figuras.
 * 
 * Uma conexão é um segmento de reta com um círculo (invisível) em cada vértice.
 */
function Connection({segments, onStartMove, onEndMove, stroke = 'black', strokeWidth = 2}) {
  return (
    <Fragment>
      {
        segments.map((segment, index) => (
          <Fragment key={segment.id}>
            <Line 
              points={[segment.start.x, segment.start.y, segment.end.x, segment.end.y]}
              stroke={stroke}
              strokeWidth={strokeWidth} />
            <Circle 
              draggable
              onDragMove={(e) => {
                const target = e.target;
                const position = new Vertex(target.x(),target.y());
                
                target.setAttrs({
                  x: segment.start.x,
                  y: segment.start.y
                })
                onStartMove(position, index);
              }}
              x={segment.start.x}
              y={segment.start.y}
              fill={FILL}
              radius={RADIUS} />
            <Circle 
              draggable
              onDragMove={(e) => {
                const target = e.target;
                const position = new Vertex(target.x(),target.y());
                
                target.setAttrs({
                  x: segment.end.x,
                  y: segment.end.y
                })

                onEndMove(position, index);
              }}
              x={segment.end.x}
              y={segment.end.y}
              fill={FILL}
              radius={RADIUS} />
          </Fragment>
        ))
      }
    </Fragment>
  )
}

export default Connection