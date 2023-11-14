import React, { useRef } from 'react';

import { Circle, Rect, RegularPolygon, Text } from 'react-konva';

import Dimension from '../types/Dimension';
import { GeneralizationType } from '../types/Generalization';
import Vertex from '../types/Vertex';

/**
 * Componente que representa uma Generalização para Diagramas do Modelo Entidade Relacionamento.
 * 
 * Uma generalização é um triângulo.
 * 
 * As generalizações são posicionados a partir de seu centro.
 */
function Generalization({ x, y, width, height, id, onDoubleClick, genType, onClick, onMove, onMoveStart, onResize, onTypeLabelMove, isDraggable = false, fontSize = 24, strokeWidth = 1, stroke = 'black', fill = "white", ...props }) {

  const nodeRef = useRef();

  return (
    <>
      {/* <Rect
        x={x - width/2}
        y={y - height/2}
        strokeWidth={strokeWidth}
        stroke={stroke}
        width={width}
        height={height}/>
      <Circle
        x={x }
        y={y}
        strokeWidth={strokeWidth}
        stroke={stroke}
        radius={width/2}/> */}
      <RegularPolygon
        ref={nodeRef}
        id={id}
        draggable={isDraggable}
        x={x}
        y={y}
        sides={3}
        radius={width/2}
        strokeWidth={strokeWidth}
        stroke={stroke}
        fill={fill}
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
          onMove(new Vertex(target.x() , target.y()));   
          target.setAttrs({
            x: x,
            y: y,
          })
        }}
        onTransform={(e) => {
          const target = e.target;
          const radius = target.getAttr('radius') * target.scaleX();

          target.setAttrs({
            scaleX: 1,
            scaleY: 1,
            x,
            y,
          })

          onResize(new Dimension(radius * 2, radius * 2));
        }}
        onPointerDblClick={(e) => {
          const event = e.evt;
          const modifiers = {
            ctrl: event.getModifierState('Control'),
            alt: event.getModifierState('Alt'),
            shift: event.getModifierState('Shift'),
          };

          onDoubleClick(nodeRef.current, modifiers);
        }}
        {...props} />

      <Text
        id={genType.id}
        draggable={isDraggable}
        onDragMove={(e) => {
          const target = e.target;
          onTypeLabelMove(new Vertex(target.x() , target.y()));
          
          target.setAttrs({
            x: genType.canvas.position.x,
            y:genType.canvas.position.y,
          })
        }}
        key={genType.id}
        x={genType.canvas.position.x}
        y={genType.canvas.position.y}
        width={genType.canvas.dimension.mainSize}
        height={genType.canvas.dimension.crossSize}
        fontSize={fontSize}
        text={GeneralizationType.getRepresentation(genType)} />
    </>

  )
}

export default Generalization