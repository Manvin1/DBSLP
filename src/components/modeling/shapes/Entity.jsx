import React, { useRef } from 'react';

import { Group, Rect, Text } from 'react-konva';

import Dimension from '../types/Dimension';
import Vertex from '../types/Vertex';

/**
 * Componente que representa uma Entidade conforme as convenções de Chang para Diagramas do Modelo Entidade Relacionamento.
 * 
 * Uma entidade é um retângulo.
 * 
 * As entidades são posicionados a partir de seu centro.
 */
function Entity({x, y, width, height, id, name, onDoubleClick, onClick, onMoveStart, onMove, onResize, isDraggable = false, fontSize = 24, strokeWidth=1, stroke='black', fill="white", ...props}) {
  
  const groupRef = useRef();

  return (
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

        onDoubleClick(modifiers);
      }}>
      <Rect
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
        align='center'
        verticalAlign='middle'
        fontSize={fontSize}
        text={name} />
    </Group>
  )
}

export default Entity