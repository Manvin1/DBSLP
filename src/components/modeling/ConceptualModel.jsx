import React, { useEffect, useRef } from 'react';

import { useActor } from '@xstate/react';
import { Layer, Stage, Transformer } from 'react-konva';

import { useModelingContext } from '../../contexts/ModelingContext';
import { useAppContext } from '../../contexts/global/AppContext';
import ViewportController from './ViewportController';
import Attribute from './shapes/Attribute';
import Connection from './shapes/Connection';
import Entity from './shapes/Entity';
import Generalization from './shapes/Generalization';
import Relation from './shapes/Relation';
import MachineEvents from './state/conceptual/MachineEvents';
import CanvasDetails from './types/CanvasDetails';
import { ConnectionTipsType } from './types/Connection';
import GeneralizationType from './types/Generalization';
import RelationType from './types/Relation';

/**
 * Obter todas as conexões que o objeto participa.
 * 
 * @param {MappedTypeDescription<{conceptual: {};logical: {};}} store
 * @param {*} object 
 * 
 * @returns {Connection[]}
 */
function getConnections(store, object) {
  return store.conceptual.connections.filter(connection => (
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
 * Componente que representa o viewport para modelagem conceitual conforme o Modelo Entidade-Relacionamento.
 */
function ConceptualModel({ size }) {
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
            store.conceptual.entities.map(entity => (
              <Entity
                isDraggable={state.context.payload.drag}
                key={entity.id}
                onDoubleClick={(modifiers) => {
                  send({
                    type: MachineEvents.ENTITY_DOUBLE_CLICK,
                    payload: {
                      modifiers,
                      entity
                    }
                  })
                }
                }
                onMoveStart={(modifiers) => {
                  if (state.context.payload.selections?.length <= 1 && !state.context.payload.selections.find(selection => selection.id === entity.id)) {
                    send({
                      type: MachineEvents.ENTITY_SELECT,
                      payload: {
                        modifiers,
                        entity,
                        position: getPointerPosition(stageRef)
                      }
                    })
                  }
                }}
                onClick={(modifiers) => {
                  send({
                    type: MachineEvents.ENTITY_SELECT,
                    payload: {
                      modifiers,
                      entity,
                      position: getPointerPosition(stageRef)
                    }
                  })
                }}
                onMove={(position) => {
                  const connections = getConnections(store, entity);
                  send({
                    type: MachineEvents.ENTITY_MOVE,
                    payload: {
                      entity,
                      position,
                      connections,
                    }
                  })
                }}
                onResize={(dimension) => {
                  const connections = getConnections(store, entity);
                  send({
                    type: MachineEvents.ENTITY_RESIZE,
                    payload: {
                      entity,
                      dimension,
                      connections
                    }
                  })
                }}
                x={entity.canvas.position.x}
                y={entity.canvas.position.y}
                width={entity.canvas.dimension.mainSize}
                height={entity.canvas.dimension.crossSize}
                id={entity.id}
                name={entity.name} />
            ))
          }
          {
            store.conceptual.relations.map(relation => (
              <Relation
                isDraggable={state.context.payload.drag}
                key={relation.id}
                onDoubleClick={(modifiers) => {
                  send({
                    type: MachineEvents.RELATION_DOUBLE_CLICK,
                    payload: {
                      modifiers,
                      relation
                    }
                  })
                }
                }
                onClick={(modifiers) => {
                  send({
                    type: MachineEvents.RELATION_SELECT,
                    payload: {
                      modifiers,
                      relation,
                      position: getPointerPosition(stageRef)
                    }
                  })
                }
                }
                onMoveStart={(modifiers) => {
                  if (state.context.payload.selections?.length <= 1
                    && !state.context.payload.selections.find(selection => selection.id === relation.id)) {
                    send({
                      type: MachineEvents.RELATION_SELECT,
                      payload: {
                        modifiers,
                        relation,
                        position: getPointerPosition(stageRef)
                      }
                    })
                  }
                }}
                onMove={(position) => {
                  const connections = getConnections(store, relation);

                  send({
                    type: MachineEvents.RELATION_MOVE,
                    payload: {
                      relation,
                      position,
                      connections
                    }
                  })
                }}
                onResize={(dimension) => {
                  const connections = getConnections(store, relation);
                  send({
                    type: MachineEvents.RELATION_RESIZE,
                    payload: {
                      relation,
                      dimension,
                      connections,
                    }
                  })
                }}
                onCardinalityMove={(cardinality, position) => {
                  send({
                    type: MachineEvents.CONCEPTUAL_CARDINALITY_MOVE,
                    payload: {
                      cardinality,
                      position
                    }
                  }) 
                }}
                cardinalities={relation.cardinalities}
                x={relation.canvas.position.x}
                y={relation.canvas.position.y}
                width={relation.canvas.dimension.mainSize}
                height={relation.canvas.dimension.crossSize}
                id={relation.id}
                name={relation.name} />
            ))
          }
          {
            store.conceptual.attributes.map(attribute => (
              <Attribute
                isDraggable={state.context.payload.drag}
                key={attribute.id}
                onDoubleClick={(modifiers) => {
                  send({
                    type: MachineEvents.ATTRIBUTE_DOUBLE_CLICK,
                    payload: {
                      modifiers,
                      attribute
                    }
                  })
                }
                }
                onClick={(modifiers) => {
                  send({
                    type: MachineEvents.ATTRIBUTE_SELECT,
                    payload: {
                      modifiers,
                      attribute,
                      position: getPointerPosition(stageRef)
                    }
                  })
                }
                }
                onMoveStart={(modifiers) => {
                  if (state.context.payload.selections?.length <= 1 
                    && !state.context.payload.selections.find(selection => selection.id === attribute.id)) {
                    send({
                      type: MachineEvents.ATTRIBUTE_SELECT,
                      payload: {
                        modifiers,
                        attribute,
                        position: getPointerPosition(stageRef)
                      }
                    })
                  }
                }}
                onMove={(position) => {
                  const connections = getConnections(store, attribute);

                  send({
                    type: MachineEvents.ATTRIBUTE_MOVE,
                    payload: {
                      attribute,
                      position,
                      connections
                    }
                  })
                }}
                onResize={(dimension) => {
                  const connections = getConnections(store, attribute);
                  send({
                    type: MachineEvents.ATTRIBUTE_RESIZE,
                    payload: {
                      attribute,
                      dimension,
                      connections
                    }
                  })
                }}
                x={attribute.canvas.position.x}
                y={attribute.canvas.position.y}
                radiusX={attribute.canvas.dimension.mainSize / 2}
                radiusY={attribute.canvas.dimension.crossSize / 2}
                isIdentifier={attribute.isIdentifier}
                id={attribute.id}
                name={attribute.name} />
            ))
          }
          {
            store.conceptual.generalizations.map(generalization => (
              <Generalization
                isDraggable={state.context.payload.drag}
                key={generalization.id}
                onDoubleClick={(modifiers) => {
                  send({
                    type: MachineEvents.GENERALIZATION_DOUBLE_CLICK,
                    payload: {
                      modifiers,
                      generalization
                    }
                  })
                }
                }
                onClick={(modifiers) => {
                  send({
                    type: MachineEvents.GENERALIZATION_SELECT,
                    payload: {
                      modifiers,
                      generalization,
                      position: getPointerPosition(stageRef)
                    }
                  })
                }
                }
                onMoveStart={(modifiers) => {
                  if (state.context.payload.selections?.length <= 1 
                    && !state.context.payload.selections.find(selection => selection.id === generalization.id)) {
                    send({
                      type: MachineEvents.GENERALIZATION_SELECT,
                      payload: {
                        modifiers,
                        generalization,
                        position: getPointerPosition(stageRef)
                      }
                    })
                  }
                }}
                onMove={(position) => {
                  const connections = getConnections(store, generalization);

                  send({
                    type: MachineEvents.GENERALIZATION_MOVE,
                    payload: {
                      generalization,
                      position,
                      connections
                    }
                  })
                }}
                onTypeLabelMove={(position) => {
                  send({
                    type: MachineEvents.GENERALIZATION_TYPE_MOVE,
                    payload: {
                      genType: generalization.genType,
                      position,
                    }
                  })
                }}
                onResize={(dimension) => {
                  const connections = getConnections(store, generalization);
                  send({
                    type: MachineEvents.GENERALIZATION_RESIZE,
                    payload: {
                      generalization,
                      dimension,
                      connections
                    }
                  })
                }}
                genType={generalization.genType}
                x={generalization.canvas.position.x}
                y={generalization.canvas.position.y}
                width={generalization.canvas.dimension.mainSize}
                height={generalization.canvas.dimension.crossSize}
                isIdentifier={generalization.isIdentifier}
                id={generalization.id} />
            ))
          }
          {
            store.conceptual.connections.map(connection => (
              <Connection
                isDraggable={state.context.payload.drag}
                key={connection.id}
                onStartMove={(position) => {
                  switch (connection.origin.type) {
                    case ConnectionTipsType.attribute: {
                      const target = store.conceptual.attributes.find(attribute => attribute.id === connection.target.id);
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
                    case ConnectionTipsType.entity: {
                      const target = store.conceptual.entities.find(entity => entity.id === connection.origin.id);
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
                    case ConnectionTipsType.relation: {
                      const target = store.conceptual.relations.find(relation => relation.id === connection.origin.id);
                      const boundingBox = RelationType.getBoundingBox(target);

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
                    case ConnectionTipsType.generalization: {
                      const target = store.conceptual.generalizations.find(generalization => generalization.id === connection.origin.id);
                      const boundingBox = GeneralizationType.getBoundingBox(target);

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
                    case ConnectionTipsType.attribute: {
                      const target = store.conceptual.attributes.find(attribute => attribute.id === connection.target.id);
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
                    case ConnectionTipsType.entity: {
                      const target = store.conceptual.entities.find(entity => entity.id === connection.target.id);
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
                    case ConnectionTipsType.generalization: {
                      const target = store.conceptual.generalizations.find(generalization => generalization.id === connection.target.id);
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
                    case ConnectionTipsType.relation: {
                      const target = store.conceptual.relations.find(relation => relation.id === connection.target.id);
                      const boundingBox = RelationType.getBoundingBox(target);

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
                  }
                }}
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

export default ConceptualModel
