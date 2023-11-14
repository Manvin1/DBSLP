import { useActor } from '@xstate/react';
import React, { useEffect, useRef } from 'react';
import { Layer, Stage, Transformer } from 'react-konva';
import { useModelingContext } from '../../contexts/ModelingContext';
import { useAppContext } from '../../contexts/global/AppContext';
import ViewportController from './ViewportController';
import Association from './shapes/Association';
import Connection from './shapes/Connection';
import Table from './shapes/Table';
import MachineEvents from './state/logical/MachineEvents';
import CanvasDetails from './types/CanvasDetails';
import { ConnectionTipsType } from './types/Connection';

/**
 * Obter todas as conexões que o objeto participa.
 * 
 * @param {MappedTypeDescription<{conceptual: {};logical: {};}} store
 * @param {*} object 
 * 
 * @returns {Connection[]}
 */
function getConnections(store, object) {
  return store.logical.connections.filter(connection => (
    connection.origin.id === object.id || connection.target.id === object.id
  ));
}

/**
 * Obter a posição do ponteiro do usuário em coordenadas locais do Canvas.
 * 
 * @param {*} stageRef 
 * @returns {Object} As coordenadas locais do ponteiro.
 */
function getPointerPosition(stageRef) {
  return stageRef.current.getRelativePointerPosition();
}

/**
 * Componente que representa o viewport para modelagem lógica conforme o Modelo Relacional.
 */
function LogicalModel({ size }) {
  const {
    setStage,
    toolMachineServices,
  } = useModelingContext();
  const {store} = useAppContext();
  const [state, send] = useActor(toolMachineServices);

  const stageRef = useRef();
  const layerRef = useRef();
  const transformerRef = useRef();

  useEffect(() => {
    setStage(stageRef.current);
  }, [stageRef.current]);
  

  useEffect(() => {
    const stage = stageRef.current;
    const transformer = transformerRef.current;

    if (!state.context.payload.selections|| !state.context.payload.selections.length) {
      transformer.nodes([]);
      return;
    }

    transformer.nodes(state.context.payload.selections.map(selection => (stage.find(`#${selection.id}`)[0])));
    transformer.getLayer().batchDraw();
  }, [state.context.payload.selections]);

  function handleStageClick(e) {
    send({
      type: MachineEvents.STAGE_CLICK,
      payload: {
        store,
        target: e.target,
        stage: e.target.getStage(),
        position: getPointerPosition(stageRef)
      }
    });
  }

  return (
    <>
      <Stage
        ref={stageRef}
        width={size.width}
        onclick={handleStageClick}
        onTap={handleStageClick}
        height={size.height}>
        <Layer ref={layerRef}>
          {
            store.logical.tables.map(table => (
              <Table
                isDraggable={state.context.payload.drag}
                key={table.id}
                onDoubleClick={(modifiers) => {
                  send({
                    type: MachineEvents.TABLE_DOUBLE_CLICK,
                    payload: {
                      modifiers,
                      table
                    }
                  })
                }
                }
                onMoveStart={(modifiers) => {
                  if (state.context.payload.selections?.length <= 1 && !state.context.payload.selections.find(selection => selection.id === table.id)) {
                    send({
                      type: MachineEvents.TABLE_SELECT,
                      payload: {
                        modifiers,
                        table,
                        position: getPointerPosition(stageRef)
                      }
                    })
                  }
                }}
                onClick={(modifiers) => {
                  send({
                    type: MachineEvents.TABLE_SELECT,
                    payload: {
                      modifiers,
                      table,
                      position: getPointerPosition(stageRef)
                    }
                  })
                }}
                onMove={(position) => {
                  const connections = getConnections(store, table);
                  send({
                    type: MachineEvents.TABLE_MOVE,
                    payload: {
                      table,
                      position,
                      connections,
                    }
                  })
                }}
                onResize={(dimension) => {
                  const connections = getConnections(store, table);
                  send({
                    type: MachineEvents.TABLE_RESIZE,
                    payload: {
                      table,
                      dimension,
                      connections
                    }
                  })
                }}
                x={table.canvas.position.x}
                y={table.canvas.position.y}
                width={table.canvas.dimension.mainSize}
                height={table.canvas.dimension.crossSize}
                id={table.id}
                columns={table.columns}
                constraints={table.constraints.map(constraint => ({
                  ...constraint,
                  reference: constraint.reference? {
                    ...constraint.reference,
                    table: store.logical.tables.find(table => table.id === constraint.reference.tableId),
                  } : constraint.reference,
                  columns: table.columns.filter(column => constraint.columnsIds.includes(column.id))
                }))}
                title={table.name} />
            ))
          }
          {
            store.logical.associations.map(association => (
              <Association
                isDraggable={state.context.payload.drag}
                cardinalities={association.cardinalities}
                onCardinalityMove={(cardinality, position) => {
                  send({
                    type: MachineEvents.LOGICAL_CARDINALITY_MOVE,
                    payload: {
                      cardinality,
                      position
                    }
                  }) 
                }}
              />
            ))
          }
          {
            store.logical.connections.map(connection => (
              <Connection
                isDraggable={state.context.payload.drag}
                key={connection.id}
                onStartMove={(position) => {
                  switch (connection.origin.type) {
                    case ConnectionTipsType.table: {
                      const target = store.logical.tables.find(table => table.id === connection.origin.id);
                      const boundingBox = CanvasDetails.getBoundingBox(target.canvas);
                      send({
                        type: MachineEvents.SEGMENT_START_MOVE,
                        payload: {
                          connection,
                          position,
                          boundingBox,
                        }
                      });
                      break;
                    }
                    default: {
                      throw Error('Unknown origin type');
                    }
                  }
                }}
                onEndMove={(position) => {
                  switch (connection.target.type) {
                    case ConnectionTipsType.table: {
                      const target = store.logical.tables.find(table => table.id === connection.target.id);
                      const boundingBox = CanvasDetails.getBoundingBox(target.canvas);

                      send({
                        type: MachineEvents.SEGMENT_END_MOVE,
                        payload: {
                          connection,
                          position,
                          boundingBox,
                        }
                      });
                      break;
                    }
                }}}
                segments={connection.segments} />
            ))
          }
          <Transformer
            rotateEnabled={false}
            ref={transformerRef} />
        </Layer>
      </Stage>
      <ViewportController 
        layerRef={layerRef}
        stageRef={stageRef} />
    </>
  )
}

export default LogicalModel
