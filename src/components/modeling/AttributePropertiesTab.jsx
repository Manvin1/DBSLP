import React, { useRef } from 'react';

import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Checkbox, Flex, Heading, Select, Text } from '@chakra-ui/react';

import { AttributeOwnerTypes } from './types/Attribute';

/**
 * Componente que representa a Tab que gerencia as propriedades específicas de Atributos do Modelo Entidade-Relacionamento.
 */
function AttributePropertiesTab({ attribute, owner, entities, relations, onOwnerChange }) {

  const selectRelationRef = useRef();

  return (
    <Accordion allowMultiple>
    <AccordionItem>
      <Heading as='h2'>
        <AccordionButton>
          <Box as="span" flex='1' textAlign='left'>
            Possuidor
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </Heading>
      <AccordionPanel pb={4}>
        <Flex 
          alignItems='flex-start'
          flexDir='column' 
          gap='1em'>
          <Text>{owner? owner.name : 'Nenhum dono definido.'}</Text>

          <Flex 
            flexWrap='wrap'
            gap='1em'>
          <Select 
            bgColor='bgColor'
            color='secondaryText'
            ref={selectRelationRef}
            placeholder='Mudar dono'>
            {
              entities.concat(relations).map(object => (
                <option 
                  key={object.id} 
                  value={object.id} 
                  data-owner-type={object.type}>{object.name}</option>
              ))
            }
          </Select>
          <Button
            onClick={() => {
              const select = selectRelationRef.current;
              const option = select.options[select.selectedIndex];

              if(!option.value)
              {
                return;
              }

              let type;
              switch(option.dataset.ownerType)
              {
                case 'entity': {
                  type = AttributeOwnerTypes.entity;
                  break;
                }
                case 'relation': {
                  type = AttributeOwnerTypes.relation;
                  break;
                } 
                default: throw Error('Unknown type');
              }
              onOwnerChange({
                type,
                id: option.value})
            }}>Definir</Button>
        </Flex>
        </Flex>
      </AccordionPanel>
    </AccordionItem>

    <AccordionItem>
      <Heading as='h2'>
        <AccordionButton>
          <Box 
            as="span" 
            flex='1' 
            textAlign='left'>
            Tipo
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </Heading>
      <AccordionPanel pb={4}>
      <Checkbox
        onChange={() => { attribute.isIdentifier = !attribute.isIdentifier }}
        isChecked={attribute.isIdentifier}>Identificador</Checkbox>
      </AccordionPanel>
    </AccordionItem>

    </Accordion>
  )
}

export default AttributePropertiesTab