import React, { useRef } from 'react'

import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Checkbox, Flex, Heading, Input, Select, Text } from '@chakra-ui/react'

import Attribute, { AttributeOwnerTypes } from './types/Attribute'
import CanvasDetails from './types/CanvasDetails'
import Cardinality, { DEFAULT_CARDINALITY_DIMENSION } from './types/Cardinality'
import Connection, { ConnectionTip, ConnectionTipsType } from './types/Connection'
import Dimension from './types/Dimension'
import Entity from './types/Entity'
import Generalization from './types/Generalization'
import RelationType from './types/Relation'
import Vertex from './types/Vertex'

/**
 * Componente que representa as propriedades específicas para Entidades do Modelo Entidade-Relacionamento.
 */
function EntityPropertiesTab({ entity, entities, attributes, relations, generalizations, store }) {

  const selectRelationRef = useRef();
  const selectGeneralizationRef = useRef();

  /**
   * Criar um novo Atributo para a Entidade.
   */
  function handleAttributeCreation()
  {
    const boundingBox = Entity.getBoundingBox(entity);

    const attribute = new Attribute({
      owner: {
        id: entity.id,
        type: AttributeOwnerTypes.entity
      },
      canvas: new CanvasDetails({
        position: new Vertex(boundingBox.x + boundingBox.w / 2, boundingBox.y - boundingBox.h / 2)
      })
    });

    const connection = new Connection(
      new ConnectionTip(ConnectionTipsType.entity,entity.id, 0.2),
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
   * Deletar um atributo da Entidade.
   * 
   * O atributo é deletado.
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
   * Deletar uma relação que a entidade participa.
   * 
   * A relação é deletada.
   * 
   * @param {String} id 
   */
  function handleRelationDelete(id)
  {
    const index = store.conceptual.relations.findIndex(relation => relation.id === id);

    store.conceptual.relations.splice(index, 1);
    Connection.removeConnectionsById(store.conceptual.connections, id);
  }

  /**
   * Criar uma nova relação com outra entidade.
   * 
   * @param {String} id 
   */
  function handleRelationCreation(id)
  {
    const lhsEntityBoundingBox = Entity.getBoundingBox(entity);
    const rhsEntity = store.conceptual.entities.find(entity => entity.id === id);
    const rhsEntityBoundingBox = Entity.getBoundingBox(rhsEntity);
    const relation = new RelationType({
        entitiesIds: [
            entity.id,
            id,
        ],
        cardinalities: [
          new Cardinality({
            participantsIds: [ entity.id ],
            canvas: new CanvasDetails({
              dimension: Dimension.clone(DEFAULT_CARDINALITY_DIMENSION),
              position: Vertex.clone(rhsEntity.canvas.position),
            })
          }),
          new Cardinality({
            participantsIds: [ id ],
            canvas: new CanvasDetails({
              dimension: Dimension.clone(DEFAULT_CARDINALITY_DIMENSION),
              position: Vertex.clone(entity.canvas.position),
            })
          })
        ],
        canvas: new CanvasDetails({
          position: new Vertex(lhsEntityBoundingBox.x + lhsEntityBoundingBox.w/2, lhsEntityBoundingBox.y - lhsEntityBoundingBox.h/2)
        })
      }
    );
    const relationBoundingBox = RelationType.getBoundingBox(relation);
    const connectionLhs = new Connection(
      {
        type: ConnectionTipsType.relation, 
        id: relation.id,
        perimeterOffset: .8,
      },
      {
        type: ConnectionTipsType.entity, 
        id: entity.id,
        perimeterOffset: 0.2,
      },
      [
        relationBoundingBox,
        lhsEntityBoundingBox,
      ]
    )
    const connectionRhs = new Connection(
      {
        type: ConnectionTipsType.relation, 
        id: relation.id,
        perimeterOffset: .6,
      },
      {
        type: ConnectionTipsType.entity, 
        id,
        perimeterOffset: 0.4,
      },
      [
        relationBoundingBox,
        rhsEntityBoundingBox,
      ]
    )
    
    store.conceptual.relations.push(relation);
    store.conceptual.connections.push(connectionLhs);
    store.conceptual.connections.push(connectionRhs);
  }

  /**
   * Deletar uma generalização que a entidade participa.
   * 
   * @param {String} id 
   */
  function handleGeneralizationDelete(id)
  {
    let index = store.conceptual.generalizations.findIndex(generalization => generalization.id === id);
    store.conceptual.generalizations.splice(index, 1);

    Connection.removeConnectionsById(store.conceptual.connections, id);
  }

  /**
   * Inserir uma entidade como derivada para uma outra entidade base.
   * 
   * Caso não haja uma generalização, uma nova é criada.
   * 
   * @param {String} id 
   */
  function handleGeneralizationInsertion(id)
  {
    const derivedEntityBoundingBox = Entity.getBoundingBox(entity);
    let generalization = store.conceptual.generalizations.find(generalization => generalization.baseId === id);

    if (generalization)
    {
      const generalizationBoundingBox = Generalization.getBoundingBox(generalization);
      const connection = new Connection(
        new ConnectionTip(ConnectionTipsType.generalization, generalization.id, 0.2),
        new ConnectionTip(ConnectionTipsType.entity, entity.id, 0.8),
        [
          generalizationBoundingBox,
          derivedEntityBoundingBox
        ]
      )

      generalization.derivedsIds.push(entity.id);
      store.conceptual.connections.push(connection);
      return;
    }

    generalization = new Generalization({
      baseId: id,
      derivedsIds: [entity.id],
      canvas: new CanvasDetails({
        position: new Vertex(derivedEntityBoundingBox.x + derivedEntityBoundingBox.w/2, derivedEntityBoundingBox.y - derivedEntityBoundingBox.h/2)
      })
    });

    const generalizationBoundingBox = Generalization.getBoundingBox(generalization);
    const baseEntity = entities.find(object => object.id === id);
    const baseEntityBoundingBox = Entity.getBoundingBox(baseEntity);

    const baseConnection = new Connection(
      new ConnectionTip(ConnectionTipsType.generalization, generalization.id, 0.2),
      new ConnectionTip(ConnectionTipsType.entity, id, 0.8),
      [
        generalizationBoundingBox,
        baseEntityBoundingBox
      ]
    )
    const derivedConnection = new Connection(
      new ConnectionTip(ConnectionTipsType.generalization, generalization.id, 0.2),
      new ConnectionTip(ConnectionTipsType.entity, entity.id, 0.8),
      [
        generalizationBoundingBox,
        derivedEntityBoundingBox
      ]
    )

    store.conceptual.generalizations.push(generalization);
    store.conceptual.connections.push(baseConnection);
    store.conceptual.connections.push(derivedConnection);
  }

  return (
    <Accordion allowMultiple>
      <AccordionItem>
        <Heading as='h2'>
          <AccordionButton>
            <Box as="span" flex='1' textAlign='left'>
              Atributos
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4}>
          <Flex flexDir='column' gap='1em' alignItems='flex-start'>
            {
              attributes.map(attribute => (
                <Flex
                  flexWrap='wrap'
                  key={attribute.id}
                  w='100%'
                  gap='1em'
                  justifyContent='space-between'>
                  <Input
                    flex
                    type='text'
                    value={attribute.name}
                    onChange={(e) => { attribute.name = e.target.value }} />

                  <Checkbox
                    onChange={() => { attribute.isIdentifier = !attribute.isIdentifier }}
                    isChecked={attribute.isIdentifier}>Identificador</Checkbox>

                  <Button
                    minWidth='min-content'
                    onClick={() => { 
                      handleAttributeDelete(attribute.id) }}
                    color='secondary'
                    bgColor='exclusion'>
                    <Text as='span'>Excluir</Text>
                  </Button>
                </Flex>

              ))
            }
            <Button
              onClick={() => {
                handleAttributeCreation()
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
              Relações
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4}>
          <Flex flexDir='column' gap='1em' alignItems='flex-start'>
            {
              relations.map(relation => (
                <Flex
                  key={relation.id}
                  w='100%'
                  gap='1em'
                  flexWrap='wrap'
                  justifyContent='space-between'>
                  <Input
                    flex
                    type='text'
                    value={relation.name}
                    onChange={(e) => { relation.name = e.target.value }} />

                  <Button
                    onClick={() => { handleRelationDelete(relation.id) }}
                    color='secondary'
                    bgColor='exclusion'>
                    <Text as='span'>Excluir</Text>
                  </Button>
                </Flex>

              ))
            }
            <Flex
              gap='1em'>
              <Select
                bgColor='bgColor'
                color='secondaryText'
                ref={selectRelationRef}
                placeholder='Selecione uma entidade'>
                {
                  entities.map(entity => (
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
                  const select = selectRelationRef.current;
                  const option = select.options[select.selectedIndex];

                  if (!option.value) {
                    return;
                  }

                  handleRelationCreation(option.value);
                }}
                color='secondary'
                bgColor='creation'
                display='flex'
                alignItems='center'
                gap='.5em'>
                <Text as='span'>Criar</Text>
              </Button>
            </Flex>
          </Flex>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading as='h2'>
          <AccordionButton>
            <Box as="span" flex='1' textAlign='left'>
              Generalizações
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4}>
          <Flex flexDir='column' gap='1em' alignItems='flex-start'>
            {
              generalizations.length? (
                generalizations.map(generalization => {
                const entity = entities.find(entity => entity.id === generalization.baseId);

                return (
                  <Flex
                    flexWrap='wrap'
                    key={generalization.id}
                    w='100%'
                    gap='1em'
                    justifyContent='space-between'>
                    <Input
                      flex
                      type='text'
                      value={entity.name}
                      onChange={(e) => { 
                        entity.name = e.target.value 
                      }} />

                    <Button
                      onClick={() => { handleGeneralizationDelete(generalization.id) }}
                      color='secondary'
                      bgColor='exclusion'>
                      <Text as='span'>Excluir</Text>
                    </Button>
                  </Flex>
                )
                })
              ) : (
                <Text> Não há generalização </Text>
              )
            }
            <Flex
              gap='1em'>
              <Select
                bgColor='bgColor'
                color='secondaryText'
                ref={selectGeneralizationRef}
                placeholder='Adicionar uma generalização'>
                {
                  entities
                    .filter(object => object.id !== entity.id)
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
                  const select = selectGeneralizationRef.current;
                  const option = select.options[select.selectedIndex];

                  if (!option.value) {
                    return;
                  }

                  handleGeneralizationInsertion(option.value);
                }}
                color='secondary'
                bgColor='creation'
                display='flex'
                alignItems='center'
                gap='.5em'>
                <Text as='span'>Adicionar</Text>
              </Button>
            </Flex>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default EntityPropertiesTab