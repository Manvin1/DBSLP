import React, { useEffect, useState } from 'react';

import { Button, Flex, FormLabel, Input, Text } from '@chakra-ui/react';
import { useActor } from '@xstate/react';

import { useModelingContext } from '../../contexts/ModelingContext';
import { useAppContext } from '../../contexts/global/AppContext';
import GeralMachineEvents from './state/MachineEvents';
import MachineEvents from './state/conceptual/MachineEvents';
import { SelectionTypes, getSelectionTarget } from './state/conceptual/selection';
import Connection from './types/Connection';
import Relation from './types/Relation';

const EMPTY_VALUE = '-';

/**
 * Componente que representa a Tab que gerencia as propriedades gerais de Entidades, Atributos, Relações e Generalizações do Modelo Entidade-Relacionamento.
 */
function ConceptualGeralTab() {
  const {
    toolMachineServices
  } = useModelingContext();

  const {store} = useAppContext();

  const [state, send] = useActor(toolMachineServices);
  const [name, setName] = useState(EMPTY_VALUE)
  const selectedTarget = getSelectionTarget(state, store);

  useEffect(() => {
    if (!selectedTarget || !selectedTarget.target.name)
    {
      setName(EMPTY_VALUE);
      return;
    }

    setName(selectedTarget.target.name);

  },[selectedTarget]);

  function handleNameChange(e)
  {
    if (!selectedTarget)
    {
      return;
    }

    const target = selectedTarget.target;

    setName(e.target.value);

    switch(selectedTarget.type)
    {
      case SelectionTypes.entity: {
        const entity = store.conceptual.entities.find(entity => entity.id === target.id);

        entity.name = e.target.value;
          
        send({
          type: MachineEvents.ENTITY_SELECT,
          payload: {
            entity,
            modifiers: {}
          }
        })
        break;
      }
      case SelectionTypes.relation: {
        const relation = store.conceptual.relations.find(relation => relation.id === target.id);
        relation.name = e.target.value;

        send({
          type: MachineEvents.RELATION_SELECT,
          payload: {
            relation,
            modifiers: {}
          }
        })
        break;
      }
      case SelectionTypes.attribute: {
        const attribute = store.conceptual.attributes.find(attribute => attribute.id === target.id);
        attribute.name = e.target.value;

        send({
          type: MachineEvents.ATTRIBUTE_SELECT,
          payload: {
            attribute,
            modifiers: {}
          }
        })
        break;
      }
    }
  }

  return (
    <Flex 
        gap='.5em'
        alignItems='flex-start'
        flexDir='column'>
        <FormLabel htmlFor='name'>
          Nome
        </FormLabel>
        <Input 
          id='name' 
          onChange={handleNameChange}
          value={name}
          isReadOnly={!Boolean(selectedTarget) || !selectedTarget.target.name}
          type='text'/>

        <Text>
          Posição
        </Text>

        <Flex 
          flexWrap='wrap'
          gap='2em'>
          <Flex 
            flexWrap='wrap'
            gap='1em'
            grow='1'
            alignItems='flex-start'>
            <FormLabel htmlFor='positionX' margin='0'>
              x
            </FormLabel>
            <Input 
              id='positionX' 
              value={selectedTarget? Number(selectedTarget.target.canvas.position.x).toFixed(3) : EMPTY_VALUE}
              isReadOnly={true}
              type='text'/>
          </Flex>

          <Flex 
            flexWrap='wrap'
            gap='1em'
            grow='1'
            alignItems='flex-start'>
            <FormLabel htmlFor='positionY' margin='0'>
              y
            </FormLabel>
            <Input 
              id='positionY'
              value={selectedTarget? Number(selectedTarget.target.canvas.position.y).toFixed(3) : EMPTY_VALUE}
              isReadOnly={true}
              type='text'/>
          </Flex>
        </Flex>
        
        <Text>
          Dimensão
        </Text>
        <Flex 
          flexWrap='wrap'
          gap='2em'>
          <Flex 
            flexWrap='wrap'
            gap='1em'
            grow='1'
            alignItems='flex-start'>
            <FormLabel htmlFor='mainSize' margin='0'>
              Tamanho Principal
            </FormLabel>
            <Input 
              id='mainSize' 
              value={selectedTarget? Number(selectedTarget.target.canvas.dimension.mainSize).toFixed(3) : '-'}
              isReadOnly={true}
              type='text'/>
          </Flex>

          <Flex 
            flexWrap='wrap'
            gap='1em'
            grow='1'
            alignItems='flex-start'>
            <FormLabel htmlFor='crossSize' margin='0'>
              Tamanho secundário
            </FormLabel>
            <Input 
              id='crossSize'
              value={selectedTarget? Number(selectedTarget.target.canvas.dimension.crossSize).toFixed(3) : EMPTY_VALUE}
              isReadOnly={true}
              type='text'/>
          </Flex>
        </Flex>

        <Button
          isDisabled={!selectedTarget}
          onClick={()=> {
            const id = selectedTarget.target.id;

            switch(selectedTarget.type)
            {
              case SelectionTypes.attribute: {
                const index = store.conceptual.attributes.findIndex(attribute => attribute.id === id);
                store.conceptual.attributes.splice(index, 1);
                break;
              }
              case SelectionTypes.entity: {
                const index = store.conceptual.entities.findIndex(entity => entity.id === id);
                store.conceptual.entities.splice(index, 1);

                const relations = store.conceptual.relations.filter(relation => relation.entitiesIds.includes(id));
                relations.forEach(relation => {
                  Relation.removeParticipantById(relation, id, store.conceptual.connections,);
                  Relation.updateCardinalities(relation, combination => {
                    const entity = store.conceptual.entities.find(entity => entity.id === combination[1]);
                    return new CanvasDetails({
                      position: Vertex.clone(entity.canvas.position),
                      dimension: Dimension.clone(DEFAULT_CARDINALITY_DIMENSION)
                    })
                  });
                })

                const attributes = store.conceptual.attributes.filter(attribute => attribute.owner.id === id);
                attributes.forEach(attribute => {
                  attribute.owner = null;
                });

                const generalizations = store.conceptual.generalizations.filter(generalization => generalization.baseId === id || generalization.derivedsIds.includes(id));
                generalizations.forEach(generalization => {
                  if (generalization.baseId === id)
                  {
                    generalization.baseId = null;
                    return;
                  }

                  const index = generalization.derivedsIds.findIndex(derivedId => derivedId === id);
                  generalization.derivedsIds.splice(index, 1);
                });
                break;
              }
              case SelectionTypes.generalization: {
                const index = store.conceptual.generalizations.findIndex(generalization => generalization.id === id);
                store.conceptual.generalizations.splice(index, 1);
                break;
              }
              case SelectionTypes.relation: {
                const index = store.conceptual.relations.findIndex(relation => relation.id === id);
                store.conceptual.relations.splice(index, 1);
                break;
              }
            }

            Connection.removeConnectionsById(store.conceptual.connections, id);
            send({
              type: GeralMachineEvents.CLEAR
            })
          }}
          color='secondary'
          bgColor='exclusion'>
          <Text as='span'>Excluir</Text>
        </Button>
    </Flex>
  )
}

export default ConceptualGeralTab