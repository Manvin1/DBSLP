import React, { useRef } from 'react';

import { Group, Rect } from 'react-konva';

import Dimension from '../types/Dimension';
import { Constraint } from '../types/Table';
import Vertex from '../types/Vertex';
import TableBody from './TableBody';
import TableConstraints from './TableConstraints';
import TableTitle from './TableTitle';

const TABLE_TITLE_COUNT = 1;

const HORIZONTAL_PADDING_FACTOR = 0.025;
const HORIZONTAL_COLUMNS_COUNT = 4;
const HORIZONTAL_PADDING_COUNT = 5;

const VERTICAL_PADDING_FACTOR = 0.05;
const VERTICAL_PADDING_COUNT_PER_SECTION = 2;

/**
 * Componente que representa uma Tabela conforme o Modelo Relacional.
 * 
 * Uma Tabela consiste de um título e cada linha especifica as características de uma coluna. Cada linha consiste de um nome, um tipo, as restrições e se um valor é opcional ou não.
 * 
 * Tabelas são posicionadas pelo seu centro.
 * 
 * Constraints devem ser populadas previamente. Ou seja, as colunas que participam dela devem fazer parte de uma propriedade 'columns' e as tabelas que são referências, para Foreign Keys, devem fazer parte de uma propriedade 'table' no Reference Object.
 */
function Table({x, y, width, height, id, title, columns, constraints, onDoubleClick, onClick, onMoveStart, onMove, onResize, isDraggable = false, fontSize = 24, strokeWidth=2, stroke='black', fill="white"}) {
  
  const groupRef = useRef();
  
  const horizontalPadding = width * HORIZONTAL_PADDING_FACTOR ;
  const horizontalPaddingTotal = horizontalPadding * HORIZONTAL_PADDING_COUNT;
  const remainingHorizontalSpace = width - horizontalPaddingTotal;
  const spacePerColumn = remainingHorizontalSpace / HORIZONTAL_COLUMNS_COUNT;

  const vertical_rows_count = (TABLE_TITLE_COUNT + columns.length + constraints.length);
  const vertical_padding_count = (
    (columns.length? VERTICAL_PADDING_COUNT_PER_SECTION + columns.length - 1 : 0)
    + (constraints.length? VERTICAL_PADDING_COUNT_PER_SECTION + constraints.length - 1 : 0)
  );

  const verticalPadding = height * VERTICAL_PADDING_FACTOR;
  const verticalPaddingTotal = verticalPadding * vertical_padding_count;
  const remainingVerticalSpace = height - verticalPaddingTotal;
  const spacePerRow = remainingVerticalSpace / vertical_rows_count;

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
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={fill}
        width={width}
        height={height}
        />
      <TableTitle 
        x={0}
        y={0}
        fill={fill}
        fontSize={fontSize}
        isDraggable={isDraggable}
        width={width}
        height={spacePerRow}
        title={title} />
      
      <TableBody
        x={0}
        y={spacePerRow + verticalPadding}
        rowHeight={spacePerRow}
        rowPadding={verticalPadding}
        columnWidth={spacePerColumn}
        columnPadding={horizontalPadding}
        fontSize={fontSize}
        fill={fill}
        columns={
          columns.map(column => {
            const columnConstraints = constraints
              .filter(constraint => constraint.columnsIds.includes(column.id))
              .map(contraint => Constraint.getRepresentation(contraint));

            return {
              ...column,
              constraints: columnConstraints
            };
          })
        } />

      <TableConstraints
        x={0}
        width={width}
        y={spacePerRow + verticalPadding + columns.length * (spacePerRow + verticalPadding)}
        rowHeight={spacePerRow}
        rowPadding={verticalPadding}
        columnWidth={spacePerColumn}
        columnPadding={horizontalPadding}
        fontSize={fontSize}
        fill={fill}
        constraints={constraints}/>
    </Group>
  )
}

export default Table