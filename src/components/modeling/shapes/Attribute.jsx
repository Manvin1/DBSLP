import React, { useRef } from 'react';

import { Ellipse, Group, Text } from 'react-konva';

import Dimension from '../types/Dimension';
import Vertex from '../types/Vertex';

/**
 * Componente que representa um Atributo conforme as convenções de Chang para Diagramas do Modelo Entidade Relacionamento.
 * 
 * Um atributo é uma elipse.
 * 
 * Os atributos são posicionados a partir de seu centro.
 */
function Attribute({x, y, radiusX, radiusY, id, name, onDoubleClick, onClick, onMoveStart, onMove, onResize, isIdentifier = false, isDraggable = false, fontSize = 16, strokeWidth=1, stroke='black', fill="white", ...props}) {
  
  const groupRef = useRef();
  
  return (
    <Group
      id={id}
      draggable={isDraggable}
      ref={groupRef}
      x={x}
      y={y}
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
        onMove(new Vertex(target.x(), target.y()));

        target.setAttrs({
          x,
          y,
        })

      }}
      onTransform={(e) => {
        const target = e.target;
        const targetWidth = target.scaleX() * radiusX * 2;
        const targetHeight = target.scaleY() * radiusY * 2;
        
        target.setAttrs({
          scaleX: 1,
          scaleY: 1,
          x,
          y
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
      <Ellipse
        x={0}
        y={0}
        radiusX={radiusX}
        radiusY={radiusY}
        strokeWidth={strokeWidth}
        stroke={stroke}
        fill={fill}
        {...props} />
      <Text
        x={-radiusX}
        y={-radiusY}
        width={radiusX * 2}
        height={radiusY * 2}
        align='center'
        verticalAlign='middle'
        textDecoration={isIdentifier? 'underline': null}
        fontSize={fontSize}
        text={name} />
    </Group>
  )
}

export default Attribute