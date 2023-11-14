import React from 'react';

import { Text } from 'react-konva';

import Cardinality from '../types/Cardinality';
import Vertex from '../types/Vertex';

/**
 * Componente que representa uma Associação entre duas Figuras.
 * 
 * Uma associação consiste dos rótulos das cardinalidades das figuras que participam da associação. A convenção usada é a do UML.
 * 
 * Os rótulos são posicionados a partir do seu vértice superior-esquerdo.
 */
function Association({cardinalities, onCardinalityMove, isDraggable = false, fontSize = 24}) {

  return (
    <>
      {
        cardinalities.map(cardinality => (
          <Text
            id={cardinality.id}
            draggable={isDraggable}
            onDragMove={(e) => {
              const target = e.target;
              onCardinalityMove(cardinality, new Vertex(target.x(), target.y()));
            }}
            key={cardinality.id}
            x={cardinality.canvas.position.x}
            y={cardinality.canvas.position.y}
            width={cardinality.canvas.dimension.mainSize}
            height={cardinality.canvas.dimension.crossSize}
            fontSize={fontSize}
            text={Cardinality.getUMLRepresentation(cardinality)} />
        ))
      }
    </>
  )
}

export default Association