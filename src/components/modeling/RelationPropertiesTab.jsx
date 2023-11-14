import React, { useRef } from 'react'

import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Checkbox, Flex, Heading, Input, Select, Text } from '@chakra-ui/react'

import Attribute, { AttributeOwnerTypes } from './types/Attribute'
import CanvasDetails from './types/CanvasDetails'
import Cardinality, { CardinalityTypes, DEFAULT_CARDINALITY_DIMENSION } from './types/Cardinality'
import Connection, { ConnectionTip, ConnectionTipsType } from './types/Connection'
import Dimension from './types/Dimension'
import Entity from './types/Entity'
import Relation from './types/Relation'
import Vertex from './types/Vertex'

/**
 * Componente que representa a Tab que gerencia as propriedades específicas de Relações do Modelo Entidade-Relacionamento.
 */
function RelationPropertiesTab({ relation, attributes, entities, store }) {

  const entitySelectRelationRef = useRef();

  /**
   * Criar um novo atributo para a relação.
   */
  function handleAttributeCreation()
  {
    const boundingBox = Relation.getBoundingBox(relation);

    const attribute = new Attribute({
      owner: {
        id: relation.id,
        type: AttributeOwnerTypes.relation
      },
      canvas: new CanvasDetails({
        position: new Vertex(boundingBox.x + boundingBox.w / 2, boundingBox.y - boundingBox.h / 2)
      })
    });

    const connection = new Connection(
      new ConnectionTip(ConnectionTipsType.relation,relation.id, 0.2),
      new ConnectionTip(ConnectionTipsType.attribute, attribute.id, 0.8),
      [
        boundingBox,
        Attribute.getBoundingBox(attribute)
      ],
    )

    store.conceptual.attributes.push(attribute);
    store.conceptual.connections.push(connection);
  }

  /**
   * Excluir um atributo ao qual a relação possui.
   * 
   * O atributo é excluido.
   * 
   * @param {String} id 
   */
  function handleAttributeDelete(id)
  {
    const index = store.conceptual.attributes.findIndex(attribute => attribute.id === id);

    store.conceptual.attributes.splice(index, 1);
    Connection.removeConnectionsById(store.conceptual.connections, id);
  }

  /**
   * Adicionar um novo entidade como participante da relação.
   * 
   * @param {String} id 
   */
  function handleParticipantInsertion(id)
  {
    const entity = store.conceptual.entities.find(entity => entity.id === id);

    Relation.addParticipant(relation, id);
    Relation.updateCardinalities(relation, combination => {
      const entity = store.conceptual.entities.find(entity => entity.id === combination[1]);
      return new CanvasDetails({
        position: Vertex.clone(entity.canvas.position),
        dimension: Dimension.clone(DEFAULT_CARDINALITY_DIMENSION)
      })
    });

    store.conceptual.connections.push(
      new Connection(
        new ConnectionTip(ConnectionTipsType.relation, relation.id, .2),
        new ConnectionTip(ConnectionTipsType.entity, id, .2),
        [Relation.getBoundingBox(relation), Entity.getBoundingBox(entity)]
      )
    );
  }

  /**
   * Remover uma entidade da participação da relação.
   * 
   * @param {String} id 
   */
  function handleParticipantDelete(id)
  {
    Relation.removeParticipantById(relation, id, store.conceptual.connections);
    Relation.updateCardinalities(relation, combination => {
      const entity = store.conceptual.entities.find(entity => entity.id === combination[1]);
      return new CanvasDetails({
        position: Vertex.clone(entity.canvas.position),
        dimension: Dimension.clone(DEFAULT_CARDINALITY_DIMENSION)
      })
    });
  }

  return (
    <Accordion allowMultiple>
      <AccordionItem>
        <Heading as='h2'>
          <AccordionButton>
            <Box 
              as="span" 
              flex='1' 
              textAlign='left'>
              Atributos
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4}>
          <Flex 
            flexDir='column' 
            gap='1em' 
            alignItems='flex-start'>
            {
              attributes.length? (
                attributes.map(attribute => (
                  <Flex
                    flexWrap='wrap'
                    key={attribute.id}
                    w='100%'
                    gap='1em'
                    justifyContent='space-between'>
                    <Input
                      type='text'
                      value={attribute.name}
                      onChange={(e) => { attribute.name = e.target.value }} />

                    <Checkbox
                      onChange={() => { attribute.isIdentifier = !attribute.isIdentifier }}
                      isChecked={attribute.isIdentifier}>Identificador</Checkbox>
                    {/* is identifier */}
                    <Button
                      onClick={() => { 
                        handleAttributeDelete(attribute.id) 
                      }}
                      color='secondary'
                      bgColor='exclusion'>
                      <Text as='span'>Excluir</Text>
                    </Button>
                  </Flex>
                ))
              ) : (
                <Text> Nenhum atributo </Text>
              )
            }
            <Button
              onClick={() => {
                handleAttributeCreation();
              }}
              color='secondary'
              bgColor='creation'
              display='flex'
              alignItems='center'
              gap='.5em'>
              <Text as='span'>Criar</Text>
            </Button>
          </Flex>

        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <Heading as='h2'>
          <AccordionButton>
            <Box as="span" flex='1' textAlign='left'>
              Participantes
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4}>
          <Flex flexDir='column' gap='1em' alignItems='flex-start'>
            {
              entities.length? (
                entities.map(entity => (
                  <Flex
                    flexWrap='wrap'
                    key={entity.id}
                    w='100%'
                    gap='1em'
                    justifyContent='space-between'>
                    <Input
                      flex
                      type='text'
                      value={entity.name}
                      onChange={(e) => { entity.name = e.target.value }} />
                    <Button
                      onClick={() => { handleParticipantDelete(entity.id) }}
                      color='secondary'
                      bgColor='exclusion'>
                      <Text as='span'>Excluir</Text>
                    </Button>
                  </Flex>
                ))
              ) : (
                <Text> Nenhuma entidade associada. </Text>
              )
            }
            <Flex
              flexWrap='wrap'
              gap='1em'>
              <Select
                bgColor='bgColor'
                color='secondaryText'
                ref={entitySelectRelationRef}
                placeholder='Selecione uma entidade'>
                {
                  store.conceptual.entities
                    .filter(entity => {
                      const firstOcurrence = entities.find(participantEntity => (
                          participantEntity.id === entity.id
                      ))
                      
                      if (firstOcurrence)
                      {
                        const lastOcurrence = entities.findLast(participantEntity => (
                          participantEntity.id === entity.id
                        ))
                        const isUnique = firstOcurrence === lastOcurrence;
                        return isUnique;
                      }

                      return true;
                    })
                      .map(entity => (
                        <option 
                          key={entity.id}
                          value={entity.id}>
                          {entity.name}
                        </option>
                      ))
                }
              </Select>
              <Button
                onClick={() => {
                  const select = entitySelectRelationRef.current;
                  const option = select.options[select.selectedIndex];

                  if (!option.value) {
                    return;
                  }

                  handleParticipantInsertion(option.value);
                }}
                color='secondary'
                bgColor='creation'
                display='flex'
                alignItems='center'
                gap='.5em'>
                <Text as='span'>Adicionar</Text>
              </Button>
            </Flex>

            <Text>Cardinalidades</Text>

            <Flex 
              flexWrap='wrap'
              gap='1em'
              flexDir='column' 
              w='100%'>
              {
                relation.cardinalities.map(cardinality => {
                  const participants = cardinality.participantsIds.map(id => (
                    entities.find(entity=> entity.id === id)))
                    
                  return (
                    <Flex 
                      flexWrap='wrap'
                      key={cardinality.id}
                      gap='1em'
                      alignItems='center'
                      justifyContent='space-between'>
                      <Text 
                        flex={1}>
                        {participants
                          .map(entity => entity.name)
                          .join(', ')}
                      </Text>

                      <Flex
                        flexWrap='wrap'
                        alignItems='center'
                        gap='.5em'
                        flex={1}>
                        {
                          <Text
                            flexBasis='20%'>
                            {Cardinality.getChangRepresentation(cardinality)}
                          </Text>
                        }
                        <Select
                          flexBasis='80%'
                          bgColor='bgColor'
                          color='secondaryText'
                          value={cardinality.cardType}
                          onChange={(e) => {
                            const select = e.target;
                            const option = select.options[select.selectedIndex];
                            
                            cardinality.cardType = option.value;
                          }}>
                          <option 
                            value={CardinalityTypes.monovalue_optional}>
                            {Cardinality.getChangRepresentationByType(CardinalityTypes.monovalue_optional)}
                          </option>

                          <option 
                            value={CardinalityTypes.monovalue_required}>
                            {Cardinality.getChangRepresentationByType(CardinalityTypes.monovalue_required)}
                          </option>

                          <option 
                            value={CardinalityTypes.multivalue_optional}>
                            {Cardinality.getChangRepresentationByType(CardinalityTypes.multivalue_optional)}
                          </option>

                          <option 
                            value={CardinalityTypes.multivalue_required}>
                            {Cardinality.getChangRepresentationByType(CardinalityTypes.multivalue_required)}
                          </option>
                        </Select>
                      </Flex>
                      
                    </Flex>
                    
                  )
                })
              }
            </Flex>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default RelationPropertiesTab