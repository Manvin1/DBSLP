import { Flex, Text } from '@chakra-ui/react';
import { useActor } from '@xstate/react';
import React from 'react';
import { useModelingContext } from '../../contexts/ModelingContext';
import { useAppContext } from '../../contexts/global/AppContext';
import TablePropertiesTab from './TablePropertiesTab';
import { SelectionTypes, getSelectionTarget } from './state/logical/selection';

/**
 * Componente que representa as propriedades específicas de uma Tabela
 */
function LogicalPropertiesTab() {
  const {
    toolMachineServices
  } = useModelingContext();
  const {store} = useAppContext();

  const [state, send] = useActor(toolMachineServices);
  const selectedTarget = getSelectionTarget(state, send, store);

  if (!selectedTarget) {
    return (
      <Flex
        alignItems='center'
        justifyContent='center'>
        <Text> Nenhum alvo selecionado.</Text>
      </Flex>
    )
  }

  const target = selectedTarget.target;

  switch (true) {
    case selectedTarget.type === SelectionTypes.table: {
      const table = store.logical.tables.find(table => table.id === target.id);
      const associations = store.logical.associations
        .filter(association => association.tablesIds.includes(table.id))
        .map(association => ({
          ...association,
          tables: store.logical.tables.filter(table => association.tablesIds.includes(table.id))
        }));

      return (
        <TablePropertiesTab
          tables={store.logical.tables}
          table={table}
          store={store}
          associations={associations}/>
      );
    }
    default: throw Error('Unexpected Type');
  }
}

export default LogicalPropertiesTab