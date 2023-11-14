import React, { useRef } from 'react';

import { Group, Text } from 'react-konva';

import Cardinality from '../types/Cardinality';
import Dimension from '../types/Dimension';
import Vertex from '../types/Vertex';
import Rhombus from '../../utils/shapes/Rhombus';

/**
 * Componente que representa uma relação conforme as convenções de Chang para Diagramas do Modelo Entidade Relacionamento.
 * 
 * Uma relação é um losango.
 * 
 * As relações são posicionados a partir de seu centro.
 */
function Relation({x, y, width, height, id, name, onDoubleClick, cardinalities, onClick, onMove, onMoveStart, onResize, onCardinalityMove, isDraggable = false, fontSize = 24, strokeWidth=1, stroke='black', fill="white", ...props}) {

  const groupRef = useRef();
  return (
    <>
      <Group
        id={id}
        draggable={isDraggable}
        ref={groupRef}
        x={x - width/2}
        y={y - height/2}
        onPointerClick={(e) => {
          const event = e.evt;
          const modifiers = {
            ctrl: event.getModifierState && event.getModifierState('Control'),
            alt: event.getModifierState && event.getModifierState('Alt'),
            shift: event.getModifierState && event.getModifierState('Shift'),
          };

          onClick(modifiers);
        }}
        onDragStart={(e) => {
          const event = e.evt;
          const modifiers = {
            ctrl: event.getModifierState && event.getModifierState('Control'),
            alt: event.getModifierState && event.getModifierState('Alt'),
            shift: event.getModifierState && event.getModifierState('Shift'),
          };
          onMoveStart(modifiers);
        }}
        onDragMove={(e) => {
          const target = e.target;
          onMove(new Vertex(target.x() + width/2, target.y() + height/2));
          
          target.setAttrs({
            x: x - width/2,
            y: y - height/2,
          })
        }}
        onTransform={(e) => {
          const target = e.target;
          const targetWidth = target.scaleX() * width;
          const targetHeight = target.scaleY() * height;
          
          target.setAttrs({
            scaleX: 1,
            scaleY: 1,
          })
          onResize(new Dimension(targetWidth, targetHeight));
        }}
        onPointerDblClick={(e) => {
          const event = e.evt;
          const modifiers = {
            ctrl: event.getModifierState('Control'),
            alt: event.getModifierState('Alt'),
            shift: event.getModifierState('Shift'),
          };

          onDoubleClick(groupRef.current, modifiers);
        }}>
        <Rhombus
          x={0}
          y={0}
          width={width}
          height={height}
          strokeWidth={strokeWidth}
          stroke={stroke}
          fill={fill}
          {...props} />
        <Text
          x={0}
          y={0}
          width={width}
          height={height}
          fontSize={fontSize}
          text={name}
          align='center'
          verticalAlign='middle' />
      </Group>
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
            text={Cardinality.getChangRepresentation(cardinality)} />
        ))
      }
    </>

  )
}

export default Relation