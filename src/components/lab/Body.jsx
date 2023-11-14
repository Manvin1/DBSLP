import React from 'react';

import { Tab as ChakraTab, Tabs as ChakraTabs, Flex, TabList, TabPanel, TabPanels, Text } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/global/AppContext';
import { DevicesTypes } from '../../hooks/useDeviceInfo';
import Result from './Result';
import SQLEditor from './SQLEditor';
import TablesView from './TablesView';

/**
 * Componente que representa uma Tab específica.
 * 
 * @param {{variant:String}} [props.variant] direção da Tab. Os valores aceitos são vertical | horizontal. 
 */
export function Tab({ children, variant }) {
  let style;

  switch (variant) {
    case 'vertical': {
      style = {
        minWidth: 'min-content',
        writingMode: 'vertical-lr'
      };
      break;
    }
    case 'horizontal': {
      style = {
        writingMode: 'horizontal-tb'
      };
      break;
    }
    default: {
      style = {};
      break;
    }
  }
  return (
    <ChakraTab
      padding='1em'
      sx={style}
      width='fit-content'
      _selected={{
        bg: 'secondaryFg'
      }} >
      {children}
    </ChakraTab>
  )
}

/**
 * Componente que representa o corpo da aplicação do laboratório.
 */
function Body() {
  const {
    deviceInfo: { isDeviceThisType }
  } = useAppContext();

  return (
    <Flex
      borderTop='1px solid'
      borderTopColor='secondaryFg'
      flexDir={{
        base: 'column',
        lg: 'row'
      }}
      flex='1'>
      <SQLEditor />

      <Flex
        flex='1'
        overflow='hidden'
        flexDir='column'>

        {
          isDeviceThisType(DevicesTypes.desktop) ? (
            <>
              <ChakraTabs
                flex='1'
                color='primaryText'
                bg='primaryFg'
                colorScheme='primaryFg'
                flexBasis='20%'
                overflow='hidden'
                orientation='vertical'>

                <TabPanels
                  overflow='scroll'>
                  <TabPanel>
                    <TablesView />
                  </TabPanel>
                </TabPanels>

                <TabList
                  borderLeft='1px solid'
                  borderLeftColor='secondaryFg'
                  alignItems='center'
                  overflow='hidden'>
                  <Tab variant='vertical'>
                    <Text>Tabelas</Text>
                  </Tab>

                </TabList>
              </ChakraTabs>

              <ChakraTabs
                borderTop='1px solid'
                borderTopColor='secondaryFg'
                flex='1'
                color='primaryText'
                bg='primaryFg'
                colorScheme='primaryFg'
                flexBasis='20%'
                overflow='hidden'
                orientation='vertical'>

                <TabPanels
                  overflow='scroll'>
                  <TabPanel>
                    <Result />
                  </TabPanel>
                </TabPanels>

                <TabList
                  borderLeft='1px solid'
                  borderLeftColor='secondaryFg'
                  alignItems='center'
                  overflow='hidden'>
                  <Tab variant='vertical'>
                    <Text>Resultados</Text>
                  </Tab>
                </TabList>
              </ChakraTabs>
            </>
          ) : (
            <ChakraTabs
              flex='1'
              color='primaryText'
              bg='primaryFg'
              colorScheme='primaryFg'
              flexBasis='20%'
              overflow='hidden'
              orientation='vertical'>

              <TabPanels
                overflow='scroll'>
                <TabPanel>
                  <TablesView />
                </TabPanel>

                <TabPanel>
                  <Result />
                </TabPanel>
              </TabPanels>

              <TabList
                borderLeft='1px solid'
                borderLeftColor='secondaryFg'
                alignItems='center'
                overflow='hidden'>
                <Tab variant='vertical'>
                  <Text>Tabelas</Text>
                </Tab>

                <Tab variant='vertical'>
                  <Text>Resultados</Text>
                </Tab>
              </TabList>
            </ChakraTabs>
          )
        }

      </Flex>
    </Flex>
  )
}

export default Body