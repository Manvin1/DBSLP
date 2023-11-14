import React from 'react';

import { Flex, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';

import { useLabContext } from '../../contexts/LabContext';

/**
 * Componente que representa o resultado retornado pela última execução do SGBD.
 */
function Result() {
  const { 
    history
  } = useLabContext();

  if (!history.length)
  {
    return (
      <Text> Nada para exibir.</Text>
    )
  }

  const lastResult = history[history.length-1];

  if(lastResult.type === 'error')
  {
    return (
      <Text>{lastResult.result}</Text>
    )
  }

  if(lastResult.type === 'table')
  {
    return (
      <Flex
        flexDir='column'>
          <time
            dateTime={lastResult.time.toLocaleTimeString()}>
            {lastResult.time.toLocaleTimeString()}
          </time>
          <TableContainer>
            <Table
              width='auto'
              sx={{
                tableLayout: 'fixed'
              }} >
              <Thead>
                <Tr>
                  {
                    lastResult.result.columns.map(column => (
                      <Th key={column}>{column}</Th>
                    ))
                  }
                </Tr>
              </Thead>
  
              <Tbody>
                {
                  lastResult.result.values.map(row => (
                    <Tr>
                      {
                        row.map(column => (
                          <Td key={column.id}>{column}</Td>
                        ))
                      }
                    </Tr>
                  ))
                }
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
    )
  }

  throw Error('Unknown type');
}

export default Result