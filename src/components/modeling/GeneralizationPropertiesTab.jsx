import React, { useRef } from 'react';

import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Flex, Heading, Input, Select, Text } from '@chakra-ui/react';

import Connection, { ConnectionTip, ConnectionTipsType } from './types/Connection';
import Entity from './types/Entity';
import Generalization, { GeneralizationType, GeneralizationTypes } from './types/Generalization';

/**
 * Componente que representa as propriedades específicas de uma Generalização.
 */
function GeneralizationPropertiesTab({generalization, baseEntity, derivedEntities, entities, store}) {

  const ownerSelectionRef = useRef();
  const derivedSelectionRef = useRef();

  /**
   * Remover a entidade base de uma generalização.
   * 
   * A generalização não é deletada.
   */
  function handleBaseEntityExclusion()
  {
    Connection.removeConnectionsByTipsId(store.conceptual.connections, generalization.id, generalization.baseId);
    generalization.baseId = null;
  }

  /**
   * Atualizar a entidade base de uma generalização.
   * 
   * @param {String} id 
   */
  function handleBaseEntityChange(id)
  {
    Connection.removeConnectionsByTipsId(store.conceptual.connections, generalization.id, generalization.baseId);
    generalization.baseId = id;

    const boundingBox = Generalization.getBoundingBox(generalization);
    const entity = store.conceptual.entities.find(entity => entity.id === id);

    const connection = new Connection(
      new ConnectionTip(ConnectionTipsType.generalization, generalization.id, 0.2),
      new ConnectionTip(ConnectionTipsType.entity, id, 0.8),
      [
        boundingBox,
        Entity.getBoundingBox(entity)
      ],
    )

    store.conceptual.connections.push(connection);
  }

  /**
   * Adicionar uma nova entidade derivada na generalização.
   * 
   * @param {String} id 
   */
  function handleDerivedInsertion(id)
  {
    generalization.derivedsIds.push(id);

    const boundingBox = Generalization.getBoundingBox(generalization);
    const entity = store.conceptual.entities.find(entity => entity.id === id);

    const connection = new Connection(
      new ConnectionTip(ConnectionTipsType.generalization, generalization.id, 0.2),
      new ConnectionTip(ConnectionTipsType.entity, id, 0.8),
      [
        boundingBox,
        Entity.getBoundingBox(entity)
      ],
    )

    store.conceptual.connections.push(connection);
  }

  /**
   * Remover uma entidade derivada de uma generalização.
   * 
   * @param {String} id 
   */
  function handleDerivedExclusion(id)
  {
    Connection.removeConnectionsByTipsId(store.conceptual.connections, generalization.id, id);
    const index = generalization.derivedsIds.findIndex(derivedId => derivedId === id);

    generalization.derivedsIds.splice(index, 1);
  }

  /**
   * Atualizar o tipo de generalização.
   * 
   * @param {GeneralizationTypes} type 
   */
  function handleTypeChange(type)
  {
    generalization.genType.type = type;
  }

  return (
    <Accordion allowMultiple>
    <AccordionItem>
      <Heading as='h2'>
        <AccordionButton>
          <Box as="span" flex='1' textAlign='left'>
            Generalização
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
            baseEntity? (
              <Flex
                flexWrap='wrap'
                w='100%'
                gap='1em'
                alignItems='center'
                justifyContent='space-between'>
                <Text>
                  {baseEntity.name}
                </Text>
                <Button
                  onClick={() => { 
                    handleBaseEntityExclusion() 
                  }}
                  color='secondary'
                  bgColor='exclusion'>
                  <Text as='span'>Remover</Text>
                </Button>
              </Flex>
            ) : (
              <Text> Nenhuma entidade genérica definida. </Text>
            )
          }
          {
            <Flex
              flexWrap='wrap'
              gap='1em'>
              <Select
                bgColor='bgColor'
                color='secondaryText'
                ref={ownerSelectionRef}
                placeholder='Selecione uma entidade base'>
                {
                  entities
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
                  const selection = ownerSelectionRef.current;
                  const option = selection.options[selection.selectedIndex];

                  handleBaseEntityChange(option.value); 
                }}
                color='secondary'
                bgColor='creation'
                display='flex'
                alignItems='center'
                gap='.5em'>
                <Text as='span'>Definir</Text>
              </Button>
            </Flex>
          }          

        </Flex>
      </AccordionPanel>
    </AccordionItem>

    <AccordionItem>
      <Heading as='h2'>
        <AccordionButton>
          <Box as="span" flex='1' textAlign='left'>
            Especializações
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </Heading>
      <AccordionPanel pb={4}>
        <Flex flexDir='column' gap='1em' alignItems='flex-start'>
          {
            derivedEntities.length? (
              derivedEntities.map(entity => (
                <Flex
                  key={entity.id}
                  flexWrap='wrap'
                  w='100%'
                  gap='1em'
                  justifyContent='space-between'>
                  <Input
                    flex
                    type='text'
                    value={entity.name}
                    onChange={(e) => { entity.name = e.target.value }} />
                  <Button
                    onClick={() => { handleDerivedExclusion(entity.id) }}
                    color='secondary'
                    bgColor='exclusion'>
                    <Text as='span'>Excluir</Text>
                  </Button>
                </Flex>
              ))
            ) : (
              <Text> Nenhuma entidade especialista. </Text>
            )
          }
          <Flex
            flexWrap='wrap'
            gap='1em'>
            <Select
              bgColor='bgColor'
              color='secondaryText'
              ref={derivedSelectionRef}
              placeholder='Selecione uma entidade'>
              {
                entities
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
                const select = derivedSelectionRef.current;
                const option = select.options[select.selectedIndex];

                if (!option.value) {
                  return;
                }

                handleDerivedInsertion(option.value);
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

    <AccordionItem>
      <Heading as='h2'>
        <AccordionButton>
          <Box as="span" flex='1' textAlign='left'>
            Tipo
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </Heading>
      <AccordionPanel pb={4}>
        <Flex 
          flexWrap='wrap'
          gap='1em' 
          alignItems='center'>
          <Text
            flex='1'>
            {GeneralizationType.getRepresentation(generalization.genType)}
          </Text>

          <Select
            flex='1'
            bgColor='bgColor'
            color='secondaryText'
            onChange={e => {
              const select = e.target;
              const option = select.options[select.selectedIndex];

              if (!option.value)
              {
                return;
              }

              handleTypeChange(option.value);
            }}
            placeholder='Selecione o tipo'>
            <option value={GeneralizationTypes.exclusive_parcial}>
              {GeneralizationType.getTypeRepresentation(GeneralizationTypes.exclusive_parcial)}
            </option>
            <option value={GeneralizationTypes.exclusive_total}>
              {GeneralizationType.getTypeRepresentation(GeneralizationTypes.exclusive_total)}
            </option>
            <option value={GeneralizationTypes.shared_parcial}>
              {GeneralizationType.getTypeRepresentation(GeneralizationTypes.shared_parcial)}
            </option>
            <option value={GeneralizationTypes.shared_total}>
              {GeneralizationType.getTypeRepresentation(GeneralizationTypes.shared_total)}
            </option>
          </Select>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
    </Accordion>
  )
}

export default GeneralizationPropertiesTab