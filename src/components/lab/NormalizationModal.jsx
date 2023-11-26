import React, { useState } from 'react';

import { Button, Flex, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, UnorderedList } from '@chakra-ui/react';

import { useDBMSContext } from '../../contexts/DBMSContext';
import { getValuesAssociation } from '../modeling/api/combinations';

const MIN_FREQUENCY = 10;
const MIN_RELATIVE_FREQUENCY = 1;

/**
 * Gerar hints (sugestões) de anomalias para as combinações geradas a partir das linhas de uma tabela.
 * 
 * A política de hints é marcar qualquer associação com uma frequência de no mínimo {@link MIN_FREQUENCY} que tenha uma frequência relativa de {@link MIN_RELATIVE_FREQUENCY}.
 * 
 * @param {Map} combinations Gerada por {@link getValuesAssociation}
 * @returns {Map<String,String[]>} Um mapa que associada um conjunto de n colunas a um array de colunas que tiveram seu valor determinado pelo valor desse conjunto pelo menos uma vez.
 */
function getHints(combinations)
{
  const hints = new Map();

  combinations.forEach((valuesMap, columns) => {
    valuesMap.forEach((relatedColumnsMap, values) => {
      relatedColumnsMap.forEach((valuesMap, relatedColumn) => {
        let max = {};

        const total = valuesMap.get('__total');
  
        valuesMap.forEach((frequency, value) => {
          if(value === '__total')
          {
            return;
          }
  
          const relativeFrequency = frequency/total;
  
          if(!max.relativeFrequency || relativeFrequency > max.relativeFrequency)
          {
            max.value = value;
            max.frequency = frequency;
            max.relativeFrequency = relativeFrequency;
          }
        })
  
        if(total >= MIN_FREQUENCY && max.relativeFrequency === MIN_RELATIVE_FREQUENCY)
        {
          if (!hints.has(columns))
          {
            hints.set(columns, []);
          }

          const relatedColumnsArray = hints.get(columns);

          if (!relatedColumnsArray.includes(relatedColumn))
          {
            relatedColumnsArray.push(relatedColumn);
          }
        }
      })
    })
  });

  return hints;
}

/**
 * Componente que representa um modal que possibilita a verificação da presença de anomalias nas Tabelas de um banco de dados relacional.
 */
function NormalizationModal({isOpen, onClose}) {
  const [currentTable, setCurrentTable] = useState();
  const [hints, setHints] = useState();

  const {dbServices} = useDBMSContext();

  const tables = dbServices.getAllTables();

  return (
    <Modal 
      isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent
      width='80%'
      height='80%'
      maxW='none'
      fontSize='lg'
      fontFamily='primary'>
      <ModalHeader>Buscador de Anomalias</ModalHeader>

      <ModalCloseButton />

      <ModalBody>
        <Flex
          height='100%'
          fontSize='xl'
          gap='1em'>
          <UnorderedList
            margin='0'
            flex='1'
            padding='1em'
            overflowY='scroll'
            listStyleType='none'
            flexDir='column'
            display='flex'>
            {
              tables.length? (
                tables.map(table => ( 
                  <ListItem 
                    letterSpacing='.1em'
                    padding='.5em'
                    _hover={{
                      cursor: 'pointer',
                      bgColor: 'primaryFg',
                      color: 'secondary'
                    }}
                    color={
                      currentTable?.name === table.name? 'secondary' : 'primary'
                    }
                    bgColor={
                      currentTable?.name === table.name? 'secondaryFg' : 'transparent'
                    }
                    onClick={()=>{
                      const combinations = getValuesAssociation(table.columns, table.rows);
                      const hints = getHints(combinations);

                      setCurrentTable(table);
                      setHints(hints);
                    }}
                    key={table.name}>
                    {table.name}
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <Text> Não há alguma tabela </Text>
                </ListItem>
              )
            }
          </UnorderedList>

          {
            currentTable? (
              <UnorderedList
                margin='0'
                padding='1em'
                flex='2'
                display='flex'
                flexDir='column'
                gap='1.5em'
                overflowY='scroll'>
                {
                  hints.length? (
                    Array
                    .from(hints)
                    .map(([columns, relatedColumnsArray]) => (
                      <ListItem key={columns}>
                      {`Valores da(s) coluna(s) ${columns} determinaram valores da(s) coluna(s) ${relatedColumnsArray.join(', ')}.`}
                    </ListItem>
                    ))
                  ) : (
                    <ListItem>Não foi encontrada alguma anomalia.</ListItem>
                  )
                }
              </UnorderedList>
            ) : (
              <Text
                padding='1em'
                overflowY='scroll'
                flex='2'>
                Nenhuma Tabela Selecionada 
              </Text>
            )
          }
        </Flex>
      </ModalBody>

      <ModalFooter>
        <Button 
          mr={3} 
          bgColor='closeMenu'
          _hover={{
            bgColor: 'closeMenuHover'
          }}
          onClick={onClose}>
          Fechar
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  )
}

export default NormalizationModal