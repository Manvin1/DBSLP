import React from 'react';

import { Shape } from 'react-konva';

/**
 * Componente que representa um losângo.
 * 
 * Um losângo é posicionado a partir de seu centro.
 */
function Rhombus({id, ...props}) {
  return (
    <Shape 
      id={id}
      sceneFunc={ (context, shape) => {
        const width = shape.getAttr('width');
        const height = shape.getAttr('height');

        context.beginPath();
        context.moveTo(width/2, 0);
        context.lineTo(width, height/2);
        context.lineTo(width/2, height);
        context.lineTo(0, height/2);
        context.closePath();

        context.fillStrokeShape(shape);
      }}
      {...props} />
  )
}

export default Rhombus