import React, { Fragment, useRef } from 'react';

import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Checkbox, Flex, FormLabel, Grid, GridItem, Heading, Input, Select, Text } from '@chakra-ui/react';

import Association from './types/Association';
import CanvasDetails from './types/CanvasDetails';
import Cardinality, { CardinalityTypes, DEFAULT_CARDINALITY_DIMENSION } from './types/Cardinality';
import Connection, { ConnectionTip, ConnectionTipsType } from './types/Connection';
import Dimension from './types/Dimension';
import Table, { Column, Constraint, ConstraintsType, Reference } from './types/Table';
import Vertex from './types/Vertex';

/**
 * Componente que representa a Tab que gerencia as propriedades específicas de uma Tabela do Modelo Relacional.
 * 
 * Toda associação deve ser pré-populada com uma propriedade 'tables' que referencia as tabelas que a participam.
 * 
 * Auto-associação não é suportado.
 */
function TablePropertiesTab({ store, table, tables, associations }) {

  const constraintNameInputRef = useRef();
  const constraintSelectInputRef = useRef();
  const associationSelectRef = useRef();

  /**
   * Criar uma nova restrição para a Tabela.
   */
  function handleConstraintCreation() {
    const selection = constraintSelectInputRef.current;
    const option = selection.options[selection.selectedIndex];

    if (!option.value) {
      return;
    }

    const name = constraintNameInputRef.current.value;

    if (!name) {
      return;
    }

    const type = option.value;
    let constraint;

    if (type === ConstraintsType.foreign_key)
    {
      constraint = new Constraint({
        name,
        type,
        reference: new Reference({})
      });
    }
    else
    {
      constraint = new Constraint({
        name,
        type,
      });
    }

    table.constraints.push(constraint);
    constraintNameInputRef.current.value = '';
  }

  /**
   * Alternar a presença de uma coluna na restrição.
   * 
   * @param {String} constraintId 
   * @param {String} columnId 
   */
  function handleConstraintColumnToggle(constraintId, columnId) {
    const constraint = table.constraints.find(constraint => constraint.id === constraintId);
    const columnsIds = constraint.columnsIds;

    const index = columnsIds.findIndex(id => id === columnId);

    if (index !== -1) {
      columnsIds.splice(index, 1);
    }
    else {
      columnsIds.push(columnId);
    }
  }

  /**
   * Deletar uma restrição.
   * 
   * @param {String} id 
   */
  function handleConstraintExclusion(id) {
    const index = table.constraints.findIndex(constraint => constraint.id === id);
    table.constraints.splice(index, 1);
  }

  /**
   * Criar uma associação com outra Tabela.
   * 
   * @param {String} id 
   */
  function handleAssociationCreation(id)
  {
    const rhsTable = tables.find(table => table.id === id);

    const association = new Association({
      tablesIds: [table.id, id],
      cardinalities: [
        new Cardinality({
          participantsIds: [table.id],
          canvas: new CanvasDetails({
            position: Vertex.clone(rhsTable.canvas.position),
            dimension: Dimension.clone(DEFAULT_CARDINALITY_DIMENSION),
          })
        }),
        new Cardinality({
          participantsIds: [id],
          canvas: new CanvasDetails({
            position: Vertex.clone(table.canvas.position),
            dimension: Dimension.clone(DEFAULT_CARDINALITY_DIMENSION),
          })
        })
      ]
    });

    const connection = new Connection(
      new ConnectionTip(
        ConnectionTipsType.table,
        table.id,
        .25),
      new ConnectionTip(
        ConnectionTipsType.table,
        id,
        .25),
      [Table.getBoundingBox(table), Table.getBoundingBox(rhsTable)]
    );

    store.logical.associations.push(association);
    store.logical.connections.push(connection);
  }

  /**
   * Alternar a presença de uma Tabela numa restrição de referência (Foreign Key).
   * 
   * @param {Reference} reference 
   * @param {String} columnId 
   */
  function handleReferenceConstraintColumnToggle(reference, columnId)
  {
    const index = reference.columnsIds.findIndex(id => id === columnId);

    if (index === -1)
    {
      reference.columnsIds.push(columnId);
    }
    else
    {
      reference.columnsIds.splice(index, 1);
    }
  }

  /**
   * Deletar uma coluna.
   * 
   * @param {String} id 
   */
  function handleColumnExclusion(id) {
    table.constraints.forEach(constraint => {
      const columnsIds = constraint.columnsIds;
      const index = columnsIds.findIndex(columnId => columnId === id);
      if (index !== -1) {
        columnsIds.splice(index, 1);
      }
    });

    const index = table.columns.findIndex(column => column.id === id);
    table.columns.splice(index, 1);
  }

  /**
   * Adicionar uma nova coluna na Tabela.
   */
  function handleColumnInsertion() {
    const column = new Column({});
    table.columns.push(column);
  }

  return (
    <Accordion allowMultiple>
      <AccordionItem>
        <Heading as='h2'>
          <AccordionButton>
            <Box as="span" flex='1' textAlign='left'>
              Restrições
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>

        <AccordionPanel pb={4}>
          <Flex flexDir='column' gap='1em' alignItems='flex-start'>
            {
              table.constraints.map(constraint => {
                return (
                  <Flex
                    flexWrap='wrap'
                    key={constraint.id}
                    gap='1em'
                    flexDir='column'>
                    <Flex
                      flexWrap='wrap'
                      w='100%'
                      gap='1em'
                      justifyContent='space-between'>
                      <Input
                        type='text'
                        value={constraint.name}
                        onChange={(e) => { constraint.name = e.target.value }} />

                      <Select
                        bgColor='bgColor'
                        color='secondaryText'
                        onChange={(e) => {
                          const select = e.target;
                          const option = select.options[select.selectedIndex];
                          constraint.type = option.value;
                        }}
                        value={constraint.type}>
                        <option
                          value={ConstraintsType.foreign_key}>
                          {Constraint.getTypeRepresentation(ConstraintsType.foreign_key)}
                        </option>

                        <option
                          value={ConstraintsType.primary_key}>
                          {Constraint.getTypeRepresentation(ConstraintsType.primary_key)}
                        </option>

                        <option
                          value={ConstraintsType.unique_key}>
                          {Constraint.getTypeRepresentation(ConstraintsType.unique_key)}
                        </option>
                      </Select>

                      <Button
                        onClick={() => {
                          handleConstraintExclusion(constraint.id)
                        }}
                        color='secondary'
                        bgColor='exclusion'>
                        <Text as='span'>Excluir</Text>
                      </Button>
                    </Flex>

                    <Text
                      marginLeft='1em'>
                      Colunas
                    </Text>

                    <Grid
                      marginLeft='2em'
                      alignItems='center'
                      templateColumns='repeat(2, 1fr)'>
                      {
                        table.columns.map(column => (
                          <>
                            <GridItem>
                              <FormLabel
                                margin='0'
                                alignItems='center'
                                gap='1em'
                                htmlFor={column.id}
                                display='flex'>
                                {column.name}
                              </FormLabel>
                            </GridItem>

                            <GridItem
                              display='flex'
                              alignItems='center'>
                              <Checkbox
                                id={column.id}
                                onChange={() => {
                                  handleConstraintColumnToggle(constraint.id, column.id);
                                }}
                                isChecked={constraint.columnsIds.includes(column.id)} />
                            </GridItem>
                          </>
                        ))
                      }
                    </Grid>

                    {
                      constraint.type === ConstraintsType.foreign_key? (
                        <Flex
                          flexDir='column'
                          gap='1em'
                          marginLeft='1em'>
                          <Text>Referencia</Text>

                          <Select
                            placeholder='Selecione uma Tabela'
                            onChange={(e) => {
                              const select = e.target;
                              const option = select[select.selectedIndex];

                              if (!option.value)
                              {
                                return;
                              }

                              constraint.reference.tableId = option.value;
                            }}
                            value={constraint.reference.tableId}>
                            {
                              tables.map(table => (
                                <option 
                                  key={table.id}
                                  value={table.id}>{table.name}
                                </option>
                              ))
                            }
                          </Select>
                          
                          {
                            constraint.reference.tableId? (
                              <Grid
                                marginLeft='2em'
                                alignItems='center'
                                templateColumns='repeat(2, 1fr)'>
                                {
                                  tables
                                    .find(table => table.id === constraint.reference.tableId)
                                    .columns.map(column => (
                                      <>
                                        <GridItem>
                                          <FormLabel
                                            margin='0'
                                            alignItems='center'
                                            gap='1em'
                                            htmlFor={column.id}
                                            display='flex'>
                                            {column.name}
                                          </FormLabel>
                                        </GridItem>

                                        <GridItem>
                                          <Checkbox
                                            id={column.id}
                                            onChange={() => {
                                              handleReferenceConstraintColumnToggle(constraint.reference, column.id);
                                            }}
                                            isChecked={constraint.reference.columnsIds.includes(column.id)} />
                                        </GridItem>
                                      </>
                                  ))
                                }
                              </Grid>
                            ) : (
                              <Text> Nenhuma Tabela Selecionada.</Text>
                            )
                          }
                        </Flex>
                      ) : undefined
                    }
                  </Flex>
                  )
              })
            }

            <Flex 
              flexWrap='wrap'
              gap='1em'>

              <Input
                ref={constraintNameInputRef}
                placeholder='Nome da restrição'
                type='text' />

              <Select
                ref={constraintSelectInputRef}
                bgColor='bgColor'
                color='secondaryText'
                placeholder='Selecionar tipo'>
                <option
                  value={ConstraintsType.foreign_key}>
                  {Constraint.getTypeRepresentation(ConstraintsType.foreign_key)}
                </option>

                <option
                  value={ConstraintsType.primary_key}>
                  {Constraint.getTypeRepresentation(ConstraintsType.primary_key)}
                </option>

                <option
                  value={ConstraintsType.unique_key}>
                  {Constraint.getTypeRepresentation(ConstraintsType.unique_key)}
                </option>
              </Select>

              <Button
                onClick={() => {
                  handleConstraintCreation();
                }}
                color='secondary'
                bgColor='creation'
                display='flex'
                alignItems='center'
                minWidth='min-content'
                gap='.5em'>
                <Text as='span'>Criar Nova Restrição  </Text>
              </Button>
            </Flex>
          </Flex>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading as='h2'>
          <AccordionButton>
            <Box as="span" flex='1' textAlign='left'>
              Colunas
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>

        <AccordionPanel pb={4}>
          <Flex 
            gap='1em'
            padding='1em'
            overflow='scroll'
            alignItems='flex-start'
            flexDir='column'>
            <Grid 
              gap='1em'
              justifyItems='center'
              alignItems='center'
              gridTemplateColumns='repeat(4, 1fr)'>
              <GridItem>
                Nome
              </GridItem>

              <GridItem>
                Tipo
              </GridItem>

              <GridItem>
                Requerido
              </GridItem>
              
              <GridItem>
                Opções
              </GridItem>
              {
                table.columns.map(column => (
                  <Fragment key={column.id}>
                    <GridItem>
                      <Input
                        minWidth='100px'
                        type='text'
                        value={column.name}
                        onChange={(e) => { column.name = e.target.value }} />
                    </GridItem>

                    <GridItem>
                      <Input
                        minWidth='100px'
                        type='text'
                        value={column.dataType}
                        onChange={(e) => { column.dataType = e.target.value }} />
                    </GridItem>

                    <GridItem>
                      <Checkbox
                        onChange={() => { column.isRequired = !column.isRequired }}
                        isChecked={column.isRequired}/>
                    </GridItem>

                    <GridItem>
                      <Button
                        onClick={() => {
                          handleColumnExclusion(column.id)
                        }}
                        color='secondary'
                        bgColor='exclusion'>
                        <Text as='span'>Excluir</Text>
                      </Button>
                    </GridItem>
                  </Fragment>
                ))
              }
            </Grid>

            <Button
                onClick={() => {
                  handleColumnInsertion()
                }}
                color='secondary'
                bgColor='creation'
                display='flex'
                alignItems='center'
                gap='.5em'>
                <Text as='span'>Criar Nova Coluna</Text>
            </Button>
          </Flex>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading as='h2'>
          <AccordionButton>
            <Box as="span" flex='1' textAlign='left'>
              Associações
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>

        <AccordionPanel pb={4}>
          <Flex
            gap='1em'
            alignItems='flex-start'
            flexDir='column'>
            {
              associations.length? (
                associations.map(association => {
                  const cardinality = association.cardinalities.find(cardinality => cardinality.participantsIds.includes(table.id));
                  const associatedTableId = association.tablesIds.find(id => id !== table.id);
                  const associatedTable = tables.find(table => table.id === associatedTableId);

                  return (
                    <Flex
                      key={association.id}
                      flexWrap='wrap'
                      marginLeft='1em'
                      gap='1em'>
                      <Text
                        flex='1'>
                        {associatedTable.name}
                      </Text>

                      <Flex
                        flexWrap='wrap'
                        alignItems='center'
                        flex='1'>
                        <Text
                          flex='1'>{Cardinality.getUMLRepresentationByType(cardinality.cardType)}</Text>

                        <Select
                          flex='1'
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
                            {Cardinality.getUMLRepresentationByType(CardinalityTypes.monovalue_optional)}
                          </option>

                          <option 
                            value={CardinalityTypes.monovalue_required}>
                            {Cardinality.getUMLRepresentationByType(CardinalityTypes.monovalue_required)}
                          </option>

                          <option 
                            value={CardinalityTypes.multivalue_optional}>
                            {Cardinality.getUMLRepresentationByType(CardinalityTypes.multivalue_optional)}
                          </option>

                          <option 
                            value={CardinalityTypes.multivalue_required}>
                            {Cardinality.getUMLRepresentationByType(CardinalityTypes.multivalue_required)}
                          </option>
                        </Select>
                      </Flex>

                    </Flex>
                  )
                })
              ) : <Text>Nenhuma associação</Text>
            }

            <Flex
              flexWrap='wrap'
              gap='1em'>
              <Select
                ref={associationSelectRef}
                bgColor='bgColor'
                color='secondaryText'
                placeholder='Selecione uma Tabela'>
                {
                  tables
                    .filter(object => object.id !== table.id)
                    .map(table => (
                    <option
                      key={table.id}
                      value={table.id}>
                      {table.name}
                    </option>
                  ))
                }
              </Select>

              <Button
                bgColor='creation'
                color='secondary'
                minWidth='min-content'
                  onClick={() => {
                    const select = associationSelectRef.current;
                    const option = select.options[select.selectedIndex];

                    if (!option.value)
                    {
                      return;
                    }

                    handleAssociationCreation(option.value);
                  }}>
                  <Text>Criar Associação</Text>
              </Button>
            </Flex>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default TablePropertiesTab